"use server";

import { DAY_IN_MILLISECONDS, PAGINATION_LIMIT, USER_BIO_MAX_LENGTH } from "@/lib/constants";
import { ERRORS } from "@/lib/errors";
import { exclude } from "@/lib/exclude";
import prisma from "@/lib/prisma";
import privyClient from "@/lib/privyClient";
import { ipfsToURL } from "@/lib/utils";
import viemClient from "@/lib/viemClient";
import { Prisma, SocialProfileType, UserSettingKeyEnum } from "@prisma/client";
import { Wallet } from "@privy-io/server-auth";
import { differenceInMinutes } from "date-fns";
// import { sendNotification } from "../notification/notification";
import { syncFarcasterFollowings } from "../socialProfile/farcasterFollowing";
import { updateRecommendations } from "../socialProfile/recommendation";
import { updateUserSocialProfiles } from "../socialProfile/socialProfile";

export const refreshAllUsersProfile = async () => {
  const users = await prisma.user.findMany();
  for (const user of users.filter(user => user.socialWallet)) {
    try {
      await updateUserSocialProfiles(user.id);
    } catch (err) {
      console.error("Error while updating social profiles for user: ", user.wallet, err);
    }
  }
  return { data: users };
};

//Refresh socials profiles
export const refreshCurrentUserProfile = async (privyUserId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      privyUserId: privyUserId
    }
  });

  if (!user) return { error: ERRORS.USER_NOT_FOUND };

  const res = await updateUserSocialProfiles(user.id);
  await syncFarcasterFollowings(user.id);
  if (user.socialWallet) {
    await updateRecommendations(user.socialWallet.toLowerCase());
  }
  return { data: res };
};

export const getCurrentUser = async (privyUserId: string) => {
  const res = await prisma.user.findUniqueOrThrow({
    where: {
      privyUserId: privyUserId
    },
    include: {
      settings: true,
      inviteCodes: {
        where: {
          isActive: true
        },
        include: {
          invitations: true
        }
      },
      socialProfiles: {
        include: {
          followings: {
            include: {
              following: true
            }
          }
        }
      },
      points: {
        where: {
          hidden: false
        }
      },
      tags: true
    }
  });

  if (res.privyUserId) {
    const privyUser = await privyClient.getUser(res.privyUserId);
    console.log(privyUser);
  }

  return { data: res };
};

export const checkUsersExist = async (wallets: string[]) => {
  const addresses = wallets.map(wallet => wallet.toLowerCase());
  const res = await prisma.user.findMany({
    where: {
      socialWallet: {
        in: addresses
      }
    }
  });
  return { data: res };
};

export const getUser = async (wallet: string) => {
  const address = wallet.toLowerCase();
  let res = await prisma.user.findUnique({
    where: {
      wallet: address
    },
    include: {
      socialProfiles: true,
      tags: true
    }
  });

  if (!res) {
    res = await prisma.user.findUnique({
      where: {
        socialWallet: address
      },
      include: {
        socialProfiles: true,
        tags: true
      }
    });
    if (!res) return { error: ERRORS.USER_NOT_FOUND };
  }

  return { data: res };
};

export const createUser = async (privyUserId: string) => {
  console.log("createUser");
  const privyUser = await privyClient.getUser(privyUserId);
  if (!privyUser) {
    return { error: ERRORS.UNAUTHORIZED };
  }

  const existingUser = await prisma.user.findUnique({ where: { privyUserId: privyUserId } });
  if (existingUser) {
    return { error: ERRORS.USER_ALREADY_EXISTS };
  }

  const embeddedWallet = privyUser.linkedAccounts.find(
    account => account.type === "wallet" && account.walletClientType === "privy" && account.connectorType === "embedded"
  ) as Wallet;

  if (!embeddedWallet) {
    return { error: ERRORS.WALLET_MISSING };
  }
  const address = embeddedWallet.address.toLowerCase();

  //If logged in with a wallet
  const wallet = privyUser.linkedAccounts.find(
    account => account.type === "wallet" && account.connectorType === "injected"
  ) as Wallet | undefined;

  const socialAddress = wallet?.address.toLowerCase();

  const newUser = await prisma.user.create({
    data: {
      privyUserId: privyUser.id,
      wallet: address,
      socialWallet: socialAddress,
      isActive: true
    }
  });

  try {
    await updateUserSocialProfiles(newUser.id);
  } catch (err) {
    console.error("Error while updating social profiles: ", err);
  }

  return { data: newUser };
};

export const linkNewWallet = async (privyUserId: string, signedMessage: string) => {
  const existingUser = await prisma.user.findUniqueOrThrow({ where: { privyUserId: privyUserId } });

  const challenge = await prisma.signingChallenge.findFirstOrThrow({
    where: {
      userId: existingUser.id
    }
  });

  if (Math.abs(differenceInMinutes(new Date(), challenge.updatedAt)) > 15) {
    return { error: ERRORS.CHALLENGE_EXPIRED };
  }

  const verified = await viemClient.verifyMessage({
    address: challenge.publicKey as `0x${string}`,
    message: challenge.message,
    signature: signedMessage as `0x${string}`
  });

  if (!verified) {
    return { error: ERRORS.INVALID_SIGNATURE };
  }

  const user = await prisma.$transaction(async tx => {
    //Clear challenge
    await tx.signingChallenge.delete({
      where: {
        userId: existingUser.id
      }
    });

    return await tx.user.update({
      where: { id: existingUser.id },
      data: {
        socialWallet: challenge.publicKey.toLowerCase()
      }
    });
  });

  try {
    await updateUserSocialProfiles(user.id);
    await updateRecommendations(challenge.publicKey.toLowerCase());
  } catch (err) {
    console.error("Error while updating social profiles: ", err);
  }

  return { data: user };
};

export interface UpdateUserArgs {
  tags?: string[];
  hasFinishedOnboarding?: boolean;
  bio?: string;
}

export const updateUser = async (privyUserId: string, updatedUser: UpdateUserArgs) => {
  if (updatedUser.tags && updatedUser.tags.length > 3) {
    return { error: ERRORS.TAGS_COUNT_INVALID };
  }

  if (updatedUser.bio !== undefined && updatedUser.bio.length > USER_BIO_MAX_LENGTH) {
    return { error: ERRORS.BIO_LENGTH_INVALID };
  }

  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { privyUserId: privyUserId },
    include: { socialProfiles: true, tags: true }
  });

  const res = await prisma.user.update({
    where: { privyUserId: privyUserId },
    data: {
      hasFinishedOnboarding: updatedUser.hasFinishedOnboarding,
      tags: updatedUser.tags
        ? {
            disconnect: existingUser.tags.map(tag => ({ id: tag.id })),
            connect: updatedUser.tags.map(tag => ({ name: tag }))
          }
        : undefined,
      bio: updatedUser.bio
    }
  });

  return { data: res };
};

export const generateChallenge = async (privyUserId: string, publicKey: string) => {
  const existingUser = await prisma.user.findUnique({ where: { socialWallet: publicKey.toLowerCase() } });
  if (existingUser) {
    return { error: ERRORS.SOCIAL_WALLET_ALREADY_LINKED };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      privyUserId
    }
  });

  const challenge = `
I'm verifying the ownership of this wallet for builderfi.
Timestamp: ${Date.now()}
Wallet: ${publicKey}
  `;

  const res = await prisma.signingChallenge.upsert({
    where: {
      userId: user.id
    },
    update: {
      message: challenge,
      publicKey
    },
    create: {
      message: challenge,
      userId: user.id,
      publicKey
    }
  });

  return { data: res };
};

export type GetUsersArgs = Omit<Prisma.UserFindManyArgs, "include" | "take" | "skip">;

export const getNewUsers = async (offset: number) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      replies: true
    },
    where: {
      isActive: true,
      hasFinishedOnboarding: true,
      displayName: { not: null }
    },
    take: PAGINATION_LIMIT,
    skip: offset
  });

  const res = users.map(user => {
    const numberOfReplies = user.replies.length;
    const numberOfQuestions = user.replies.filter(reply => !!reply.repliedOn).length;
    const strippedUser = exclude(user, "replies");
    return { ...strippedUser, numberOfReplies, numberOfQuestions };
  });

  return { data: res };
};

export const getTopUsersByQuestionsAsked = async (offset: number) => {
  const users = await prisma.user.findMany({
    orderBy: {
      questions: {
        _count: "desc"
      }
    },
    include: {
      questions: true,
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    },
    where: {
      isActive: true,
      hasFinishedOnboarding: true,
      displayName: { not: null }
    },
    take: PAGINATION_LIMIT,
    skip: offset
  });

  const res = users.map(user => {
    const questionsAsked = user.questions.length;
    const questionsAnswered = user.questions.filter(question => !!question.repliedOn).length;
    const numberOfHolders = user.keysOfSelf.length;
    const strippedUser = exclude(user, ["keysOfSelf", "questions"]);
    return { ...strippedUser, questionsAsked, questionsAnswered, numberOfHolders };
  });

  return { data: res };
};

export const getTopUsersByQuestionsAskedInTimeInterval = async (
  options: { startDate?: Date; limit?: number } = {
    startDate: new Date(new Date().getTime() - 7 * DAY_IN_MILLISECONDS),
    limit: 10
  }
) => {
  const { startDate, limit } = options;

  // First, get the users and their question counts
  const usersWithQuestionCounts = await prisma.user.findMany({
    select: {
      id: true,
      _count: {
        select: { questions: true }
      }
    },
    where: {
      isActive: true,
      hasFinishedOnboarding: true,
      displayName: { not: null },
      questions: {
        some: {
          createdAt: {
            gte: startDate
          }
        }
      },
      socialProfiles: {
        some: {
          type: SocialProfileType.FARCASTER
        }
      }
    }
  });

  // Filter out users with 0 questions and sort the remaining users by question count in descending order
  const filteredUsers = usersWithQuestionCounts.filter(user => user._count.questions > 0);
  filteredUsers.sort((a, b) => b._count.questions - a._count.questions);

  // Get the IDs of the top users
  const topUserIds = filteredUsers.slice(0, limit).map(user => user.id);

  // Then, get the full user data for the top users
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: topUserIds
      },
      socialProfiles: {
        some: {
          type: SocialProfileType.FARCASTER
        }
      }
    },
    include: {
      questions: true,
      socialProfiles: true,
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    }
  });

  const res = users.map(user => {
    const questionsAsked = user.questions.length;
    const questionsAnswered = user.questions.filter(question => !!question.repliedOn).length;
    const numberOfHolders = user.keysOfSelf.length;
    const strippedUser = exclude(user, ["keysOfSelf", "questions"]);
    return { ...strippedUser, questionsAsked, questionsAnswered, numberOfHolders };
  });

  return { data: res };
};

export const getTopUsersByAnswersGiven = async (offset: number) => {
  //First get all questions grouped by replier, and sort by replies count
  const questions = await prisma.question.groupBy({
    where: { reply: { not: null }, replierId: { not: null } },
    by: ["replierId"],
    orderBy: { _count: { reply: "desc" } },
    _count: { reply: true },
    take: PAGINATION_LIMIT,
    skip: offset
  });
  const repliers =
    questions?.filter(question => !!question.replierId).map(question => question.replierId as number) || [];
  const users = await prisma.user.findMany({
    include: {
      replies: true,
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    },
    where: {
      isActive: true,
      hasFinishedOnboarding: true,
      displayName: { not: null },
      id: {
        in: repliers
      }
    }
  });

  const res = users.map(user => {
    const questionsReceived = user.replies.length;
    const questionsAnswered = user.replies.filter(reply => !!reply.repliedOn).length;
    const numberOfHolders = user.keysOfSelf.length;
    const strippedUser = exclude(user, ["keysOfSelf", "replies"]);
    return { ...strippedUser, questionsReceived, questionsAnswered, numberOfHolders };
  });

  return { data: res.sort((a, b) => b.questionsAnswered - a.questionsAnswered) };
};

export const getTopUsersByAnswersGivenInTimeInterval = async (
  options: { startDate?: Date; limit?: number } = {
    startDate: new Date(new Date().getTime() - 7 * DAY_IN_MILLISECONDS),
    limit: 10
  }
) => {
  const { startDate, limit } = options;
  // First, get the users and their reply counts
  const usersWithReplyCounts = await prisma.user.findMany({
    select: {
      id: true,
      _count: {
        select: { replies: true }
      }
    },
    where: {
      isActive: true,
      hasFinishedOnboarding: true,
      displayName: { not: null },
      replies: {
        some: {
          repliedOn: {
            gte: startDate
          }
        }
      },
      socialProfiles: {
        some: {
          type: SocialProfileType.FARCASTER
        }
      }
    }
  });

  // Filter out users with 0 replies and sort the remaining users by reply count in descending order
  const filteredUsers = usersWithReplyCounts.filter(user => user._count.replies > 0);
  filteredUsers.sort((a, b) => b._count.replies - a._count.replies);

  // Get the IDs of the top users
  const topUserIds = filteredUsers.slice(0, limit).map(user => user.id);

  // Then, get the full user data for the top users
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: topUserIds
      },
      socialProfiles: {
        some: {
          type: SocialProfileType.FARCASTER
        }
      }
    },
    include: {
      replies: true,
      socialProfiles: true,
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    }
  });

  const res = users
    .map(user => {
      const questionsReceived = user.replies.length;
      const questionsAnswered = user.replies.filter(reply => !!reply.repliedOn).length;
      const numberOfHolders = user.keysOfSelf.length;
      const strippedUser = exclude(user, ["keysOfSelf", "replies"]);
      return { ...strippedUser, questionsReceived, questionsAnswered, numberOfHolders };
    })
    .sort((a, b) => b.questionsAnswered - a.questionsAnswered);

  return { data: res };
};

type TopUserByKeysOwned = Prisma.$UserPayload["scalars"] & {
  ownedKeys: number;
  socialProfileName?: string;
  numberOfHolders?: number;
};

export const getTopUsersByKeysOwned = async (offset: number) => {
  const users = (await prisma.$queryRaw`
      SELECT "User".*, CAST(COALESCE(SUM("KeyRelationship".amount), 0) AS INTEGER) as "ownedKeys"
      FROM "User"
      LEFT JOIN "KeyRelationship" ON "User".id = "KeyRelationship"."holderId"
      WHERE "User"."isActive" = true AND "User"."hasFinishedOnboarding" = true AND "User"."displayName" IS NOT NULL
      GROUP BY "User".id
      ORDER BY "ownedKeys" DESC
      LIMIT ${PAGINATION_LIMIT} OFFSET ${offset};
    `) as TopUserByKeysOwned[];

  const usersNumberOfHolders = await prisma.user.findMany({
    where: {
      id: {
        in: users.map(user => user.id)
      }
    },
    include: {
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    }
  });

  const usersMap = new Map<number, (typeof usersNumberOfHolders)[number]>();
  for (const user of usersNumberOfHolders) {
    usersMap.set(user.id, user);
  }

  users.forEach(user => {
    const foundUser = usersMap.get(user.id);
    user.numberOfHolders = foundUser?.keysOfSelf.length || 0;
  });

  return { data: users };
};

export const getTopUsersByKeysOwnedWithSocials = async (limit: number = 10) => {
  const users = (await prisma.$queryRaw`
      SELECT "User".*, "SocialProfile"."profileName" as "socialProfileName", CAST(COALESCE(SUM("KeyRelationship".amount), 0) AS INTEGER) as "ownedKeys"
      FROM "User"
      LEFT JOIN "KeyRelationship" ON "User".id = "KeyRelationship"."holderId"
      INNER JOIN "SocialProfile" ON "User".id = "SocialProfile"."userId" AND "SocialProfile"."type" = 'FARCASTER'
      WHERE "User"."isActive" = true AND "User"."hasFinishedOnboarding" = true AND "User"."displayName" IS NOT NULL
      GROUP BY "User".id, "SocialProfile"."profileName"
      ORDER BY "ownedKeys" DESC
        LIMIT ${limit}
    `) as TopUserByKeysOwned[];

  const usersNumberOfHolders = await prisma.user.findMany({
    where: {
      id: {
        in: users.map(user => user.id)
      }
    },
    include: {
      keysOfSelf: {
        where: {
          amount: {
            gt: 0
          }
        }
      }
    }
  });

  const usersMap = new Map<number, (typeof usersNumberOfHolders)[number]>();
  for (const user of usersNumberOfHolders) {
    usersMap.set(user.id, user);
  }

  users.forEach(user => {
    const foundUser = usersMap.get(user.id);
    user.numberOfHolders = foundUser?.keysOfSelf.length || 0;
  });

  return { data: users };
};

type TopUser = Prisma.$UserPayload["scalars"] & {
  numberOfHolders: number;
  numberOfQuestions: number;
  numberOfReplies: number;
  followerCount: number;
};

export const getTopUsers = async (offset: number) => {
  const users = (await prisma.$queryRaw`
    SELECT * FROM (
      SELECT "User".*, 
      CAST(COUNT(DISTINCT CASE WHEN "KeyRelationship".amount > 0 THEN "KeyRelationship".id END) AS INTEGER) AS "numberOfHolders",
      CAST(COUNT(DISTINCT "Question".id) AS INTEGER) AS "numberOfQuestions",
      CAST(COUNT(DISTINCT CASE WHEN "Question".reply IS NOT NULL THEN "Question".id END) AS INTEGER) AS "numberOfReplies",
      CAST("SocialProfile"."followerCount" as INTEGER) AS "followerCount"
      FROM "User"
      LEFT JOIN "KeyRelationship" ON "User".id = "KeyRelationship"."ownerId"
      LEFT JOIN "Question" ON "User".id = "Question"."replierId"
      LEFT JOIN "SocialProfile" ON "User".id = "SocialProfile"."userId" and "SocialProfile"."type" = 'FARCASTER'
      WHERE "User"."isActive" = true 
      AND "User"."hasFinishedOnboarding" = true 
      AND "User"."displayName" IS NOT NULL
      GROUP BY "User".id, "SocialProfile"."followerCount"
    ) AS subquery
    ORDER BY 
        CASE 
            WHEN "followerCount" >= 3000 THEN "followerCount"
			ELSE "numberOfHolders"
    END DESC
    LIMIT ${PAGINATION_LIMIT} OFFSET ${offset};
  `) as TopUser[];

  return { data: users };
};

export const getBulkUsers = async (addresses: string[]) => {
  // get all users
  const usersWithReplies = await prisma.user.findMany({
    where: { wallet: { in: addresses }, isActive: true, hasFinishedOnboarding: true, displayName: { not: null } },
    include: { replies: true }
  });

  // split the count of replies and questions
  const users = usersWithReplies.map(user => ({
    ...user,
    questions: user.replies.length,
    replies: user.replies.filter(reply => !!reply.repliedOn).length
  }));

  return {
    data: users
  };
};

const sanitizeAvatarUrl = (avatarUrl: string) => {
  if (!avatarUrl) return avatarUrl;

  if (avatarUrl.includes("talentprotocol")) {
    const imageUrl = new URL(avatarUrl);
    return imageUrl.origin + imageUrl.pathname;
  }

  if (avatarUrl.includes("ipfs://")) {
    return ipfsToURL(avatarUrl);
  }

  return avatarUrl;
};

export const getRecommendedUsers = async (address: string) => {
  if (!address) return { data: [] };

  const user = await prisma.user.findUnique({ where: { wallet: address.toLowerCase() } });
  if (!user) return { error: ERRORS.USER_NOT_FOUND };

  const recommendations = await prisma.recommendedUser.findMany({
    where: { forId: user.id },
    orderBy: { recommendationScore: "desc" }
  });

  const usersFromRecommendations = await prisma.user.findMany({
    where: { socialWallet: { in: recommendations.map(rec => rec.wallet).filter(i => i !== null) as string[] } },
    include: { replies: true }
  });

  const users = recommendations.map(rec => {
    const foundUser = usersFromRecommendations.find(u => u.socialWallet === rec.wallet);
    return {
      ...rec,
      avatarUrl: sanitizeAvatarUrl(rec.avatarUrl || ""),
      wallet: foundUser?.wallet || rec.wallet,
      socialWallet: rec.wallet,
      userId: !!foundUser ? foundUser.id : rec.userId,
      questions: !!foundUser ? foundUser.replies.length : 0,
      replies: !!foundUser ? foundUser.replies.filter(reply => !!reply.repliedOn).length : 0,
      createdAt: !!foundUser ? foundUser.createdAt : rec.createdAt,
      bio: !!foundUser ? foundUser.bio : ""
    };
  });

  return {
    data: users
  };
};

export const getRecommendedUser = async (wallet: string) => {
  if (!wallet) return { data: null };

  const address = wallet.toLowerCase();
  const res = await prisma.recommendedUser.findFirst({
    where: {
      wallet: address
    }
  });

  if (!res) return { error: ERRORS.USER_NOT_FOUND };

  return { data: { ...res, avatarUrl: sanitizeAvatarUrl(res.avatarUrl || "") } };
};

type SearchUser = Prisma.$UserPayload["scalars"] & {
  soldKeys: number;
  numberOfHolders: number;
  numberOfQuestions: number;
  numberOfReplies: number;
};

export const search = async (
  privyUserId: string,
  searchValue: string,
  includeOwnedKeysOnly: boolean,
  offset: number
) => {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: {
      privyUserId: privyUserId
    }
  });
  //We use raw query to order by soldKeys
  const users = (await prisma.$queryRaw`
    SELECT "User".*, CAST(COALESCE(SUM(DISTINCT "KeyRelationship".amount), 0) AS INTEGER) as "soldKeys",
    CAST(COUNT(DISTINCT "KeyRelationship"."holderId") AS INTEGER) as "numberOfHolders",
    CAST(COUNT(DISTINCT "Question".id) AS INTEGER) as "numberOfQuestions",
    CAST(COUNT(DISTINCT CASE WHEN "Question".reply IS NOT NULL THEN "Question".id END) AS INTEGER) as "numberOfReplies"
    FROM "User"
    LEFT JOIN "KeyRelationship" ON "User".id = "KeyRelationship"."ownerId"
    LEFT JOIN "SocialProfile" ON "User".id = "SocialProfile"."userId"
    LEFT JOIN "Question" ON "User".id = "Question"."replierId"
    WHERE "User"."isActive" = true
      AND "User"."hasFinishedOnboarding" = true 
      AND (
        "User"."wallet" ILIKE '%' || ${searchValue} || '%'
        OR "User"."socialWallet" ILIKE '%' || ${searchValue} || '%'
        OR EXISTS (
          SELECT 1
          FROM "SocialProfile"
          WHERE "SocialProfile"."userId" = "User".id
            AND "SocialProfile"."profileName" ILIKE '%' || ${searchValue} || '%'
        )
      )
      AND (
        NOT ${includeOwnedKeysOnly} 
        OR EXISTS (
          SELECT 1
          FROM "KeyRelationship"
          WHERE "KeyRelationship"."ownerId" = ${currentUser.id}
            AND "KeyRelationship"."holderId" = "User".id
        )
  )
    GROUP BY "User".id
    ORDER BY "soldKeys" DESC
    LIMIT ${PAGINATION_LIMIT} OFFSET ${offset};
  `) as SearchUser[];

  return {
    data: users
  };
};

export const getUserStats = async (id: number) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id
    },
    select: {
      _count: {
        select: {
          questions: {
            where: {
              replierId: null
            }
          },
          comments: {
            where: {
              question: {
                replierId: null
              }
            }
          },
          replies: {
            where: {
              repliedOn: {
                not: null
              }
            }
          },
          keysOfSelf: {
            where: {
              amount: {
                gt: 0
              }
            }
          },
          keysOwned: {
            where: {
              amount: {
                gt: 0
              }
            }
          }
        }
      }
    }
  });

  return {
    data: {
      numberOfHolders: user._count.keysOfSelf,
      numberOfHolding: user._count.keysOwned,
      answersCount: user._count.replies,
      openQuestionsReplied: user._count.comments,
      openQuestionsAsked: user._count.questions
    }
  };
};

export const setUserSetting = async (privyUserId: string, key: UserSettingKeyEnum, value: string) => {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: {
      privyUserId
    }
  });

  const res = await prisma.userSetting.upsert({
    where: {
      userId_key: {
        userId: currentUser.id,
        key
      }
    },
    update: {
      value
    },
    create: {
      userId: currentUser.id,
      key,
      value
    }
  });

  return { data: res };
};

//users we can ask questions to
export const getQuestionableUsers = async (privyUserId: string, search?: string, offset = 0) => {
  const formattedSearch = search ? search.toLowerCase().trim() : undefined;
  const validUsersCondition = [
    {
      keysOfSelf: {
        some: {
          holder: {
            privyUserId
          },
          amount: {
            gt: 0
          }
        }
      }
    },
    { keysOfSelf: { none: {} } }
  ];

  //users we hold a key of
  const res = await prisma.user.findMany({
    where: {
      hasFinishedOnboarding: true,
      isActive: true,
      displayName: { not: null },
      AND: formattedSearch
        ? [
            { OR: validUsersCondition },
            {
              OR: [
                {
                  displayName: { contains: formattedSearch, mode: "insensitive" }
                },
                {
                  socialProfiles: {
                    some: {
                      profileName: {
                        contains: formattedSearch,
                        mode: "insensitive"
                      }
                    }
                  }
                },
                {
                  wallet: {
                    contains: formattedSearch,
                    mode: "insensitive"
                  }
                },
                {
                  socialWallet: {
                    contains: formattedSearch,
                    mode: "insensitive"
                  }
                }
              ]
            }
          ]
        : [{ OR: validUsersCondition }]
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      wallet: true,
      bio: true,
      _count: {
        select: {
          keysOfSelf: {
            where: {
              holder: {
                privyUserId
              },
              amount: {
                gt: 0
              }
            }
          }
        }
      }
    },
    orderBy: {
      keysOfSelf: {
        _count: "desc"
      }
    },
    take: PAGINATION_LIMIT,
    skip: offset
  });

  return { data: res };
};

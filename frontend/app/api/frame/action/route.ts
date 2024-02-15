import { BASE_URL } from "@/lib/constants";
import { commentQuestion, getQuestionImageUrl, upvoteQuestion } from "@/lib/frame/questions";
import prisma from "@/lib/prisma";
import { SocialProfileType } from "@prisma/client";
import { FrameActionPayload, getFrameHtml, getFrameMessage, validateFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? undefined;
  if (!id) {
    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: getQuestionImageUrl(0),
        buttons: [{ label: "try again", action: "post" }],
        postUrl: `${BASE_URL}/api/frame/action?id=${id}`
      })
    );
  }

  const accountAddress = "";
  // Step 2. Read the body from the Next Request
  const body: FrameActionPayload = await req.json();

  const frameMessage = await getFrameMessage(body);
  // Step 3. Validate the message
  const { isValid } = await validateFrameMessage(body, {
    hubRequestOptions: { headers: { api_key: process.env.NEYNAR_API_KEY! } }
  });

  // Step 4. Determine the experience based on the validity of the message
  if (!isValid) {
    return new NextResponse(null, { status: 400 });
  }

  console.log("Account address is", accountAddress);
  console.log("button index", frameMessage.buttonIndex);

  const farcasterProfile = await prisma.socialProfile.findFirst({
    where: { profileName: frameMessage.requesterUserData?.username, type: SocialProfileType.FARCASTER },
    include: { user: true }
  });
  if (!farcasterProfile) {
    throw new Error("No farcaster identity");
  }

  // index 2 means the user clicked the "reply" to the open question
  if (frameMessage.buttonIndex === 2) {
    try {
      let text: string | undefined = "";
      if (frameMessage.inputText) {
        text = frameMessage.inputText;
      }
      if (!text || text == "") {
        throw new Error("No text");
      }
      
      await commentQuestion(farcasterProfile.profileName, parseInt(id), text);
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: getQuestionImageUrl(id, false, true),
          buttons: [{ label: "read more on builder.fi 👀", action: "post_redirect" }],
          postUrl: `${BASE_URL}/api/frame/redirect?id=${id}`
        })
      );
    } catch (e) {
      console.error(e);
      return new NextResponse(
        getFrameHtml({
          version: "vNext",
          image: getQuestionImageUrl(id),
          buttons: [{ label: "try again", action: "post" }],
          postUrl: `${BASE_URL}/api/frame/action?id=${id}`
        })
      );
    }
  }
  // index 1 means the user clicked the "upvote" to the open question
  try {
    await upvoteQuestion(farcasterProfile.profileName, parseInt(id));
    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: getQuestionImageUrl(id, true),
        buttons: [{ label: "read more on builder.fi 👀", action: "post_redirect" }],
        postUrl: `${BASE_URL}/api/frame/redirect?id=${id}`
      })
    );
  } catch (e) {
    console.error(e);
    return new NextResponse(
      getFrameHtml({
        version: "vNext",
        image: getQuestionImageUrl(id),
        buttons: [{ label: "try again", action: "post" }],
        postUrl: `${BASE_URL}/api/frame/action?id=${id}`
      })
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";

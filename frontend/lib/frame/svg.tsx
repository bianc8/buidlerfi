import { Question, Reaction, Tag, User } from "@prisma/client";
import * as fs from "fs";
import { join } from "path";
import satori from "satori";
import Avatar from "./components/avatar";

const regularFontPath = join(process.cwd(), "public/assets", "SpaceGrotesk-Regular.ttf");
const regularFontData = fs.readFileSync(regularFontPath);

const boldFontPath = join(process.cwd(), "public/assets", "SpaceGrotesk-SemiBold.ttf");
const boldFontData = fs.readFileSync(boldFontPath);

const imageQuestionMark = fs.readFileSync(join(process.cwd(), "public/assets", "question-mark.png"));
const imageArrows = fs.readFileSync(join(process.cwd(), "public/assets", "arrows.png"));
const imageBFLogoBlue = fs.readFileSync(join(process.cwd(), "public/assets", "bf-logoword-blue.png"));

export interface Profile {
  imageUrl: string;
  username: string;
}

export interface QuestionWithInfo extends Question {
  tags?: Tag[];
  questioner?: User;
  replier?: User;
  reactions?: Reaction[];
}

export const generateImageSvg = async (
  question: QuestionWithInfo,
  upvoted = false,
  replied = false
): Promise<string> => {
  return await satori(
    <div
      style={{
        backgroundColor: "#F3F5F6",
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        alignItems: "center",
        width: "100%",
        height: "100%",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around", // This will space your main divs evenly
          height: "100%" // Make sure your div takes up the full height for 'space-between' to have effect
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "0.5rem",
            height: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%"
            }}
          >
            <img src={`data:image/png;base64,${imageBFLogoBlue.toString("base64")}`} height={"16px"} />
          </div>
          <div
            style={{
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%"
            }}
          >
            <img
              src={`data:image/png;base64,${imageQuestionMark.toString("base64")}`}
              style={{ width: "7%", alignItems: "center" }}
            />
            <span
              style={{
                width: "85%",
                color: "#316CF0",
                fontSize: "24px",
                marginLeft: "20px"
              }}
            >
              {question.questionContent.length > 130
                ? `${question.questionContent.substring(0, 130)}...`
                : question.questionContent}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            {question.replierId == null && question.tags && question.tags?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  verticalAlign: "center",
                  fontSize: "16px",
                  width: "100%"
                }}
              >
                asked an open question about
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "0.8rem",
                    padding: "0.35rem 0.55rem", // paddingY paddingX
                    border: "1px solid #0b0d0e40",
                    borderRadius: "7999px",
                    marginLeft: "0.4rem"
                  }}
                >
                  {question.tags[0]
                    ? question.tags[0].name.length > 20
                      ? `${question.tags[0].name.toLowerCase().substring(0, 20)}...`
                      : `${question.tags[0].name.toLowerCase()}`
                    : "general"}
                </div>
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                width: `${question.replierId != null ? "45%" : "100%"}`,
                justifyContent: "center"
              }}
            >
              <Avatar
                imageUrl={question.questioner?.avatarUrl as string}
                username={question.questioner?.displayName as string}
                userAddress={question.questioner?.wallet as string}
                bio={question!.questioner?.bio as string}
              />
            </div>
            {question.replierId != null ? (
              <div
                style={{
                  width: `${question.replierId != null ? "55%" : "0%"}`,
                  alignItems: "center",
                  display: `${question.replierId != null ? "flex" : "none"}`
                }}
              >
                <img
                  src={`data:image/png;base64,${imageArrows.toString("base64")}`}
                  style={{ display: "flex", width: "15%", alignItems: "center" }}
                />

                <div
                  style={{
                    display: "flex",
                    maxWidth: "85%",
                    justifyContent: "center",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                >
                  <Avatar
                    imageUrl={question.replier?.avatarUrl as string}
                    username={question.replier?.displayName as string}
                    userAddress={question.replier?.wallet as string}
                    bio={question.replier?.bio as string}
                  />
                </div>
              </div>
            ) : null}
          </div>
          {(upvoted || replied) && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "1rem"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  backgroundColor: "#316CF0",
                  color: "#FFFFFF",
                  padding: "6px",
                  borderRadius: "4px"
                }}
              >
                {upvoted ? "upvoted" : "replied"} successfully!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    {
      width: 600,
      height: 315,
      fonts: [
        {
          data: regularFontData,
          name: "SpaceGrotesk-Regular"
        },
        {
          data: boldFontData,
          name: "SpaceGrotesk-SemiBold"
        }
      ]
    }
  );
};

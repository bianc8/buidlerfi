import UpdateQuestion from "@/backend/services/questions/update";

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  try {
    const body = await req.json();
    const question = await UpdateQuestion.call(Number(params.id), body.answerContent);

    return Response.json({ data: question }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unexpected error. Contact Us." }, { status: 500 });
  }
}

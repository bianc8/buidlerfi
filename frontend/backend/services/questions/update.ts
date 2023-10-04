import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const call = async (questionId: number, answerContent: string) => {
	const question = await prisma.question.update({
		where: {
			id: questionId,
		},
		data: {
			answerContent: answerContent,
		},
	});

	return question;
};

const UpdateQuestion = {
	call,
};

export default UpdateQuestion;

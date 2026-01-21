import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { testId, answers, timeSpent } = req.body;

    if (!testId || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get test
    const test = await prisma.mockTest.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const questions = JSON.parse(test.questions);
    
    // Calculate score
    let correctAnswers = 0;
    const feedback = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      feedback.push({
        questionId: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || "",
      });
    });

    const score = correctAnswers;
    const percentage = (correctAnswers / test.totalQuestions) * 100;
    const passed = percentage >= test.passingScore;

    // Save attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId: session.user.id,
        testId,
        answers: JSON.stringify(answers),
        score,
        percentage,
        timeSpent: parseInt(timeSpent) || 0,
        passed,
        completedAt: new Date(),
        feedback: JSON.stringify(feedback),
      },
      include: {
        test: {
          select: {
            title: true,
            category: true,
            difficulty: true,
          }
        }
      }
    });

    return res.status(201).json({
      ...attempt,
      answers: JSON.parse(attempt.answers),
      feedback: JSON.parse(attempt.feedback),
    });
  } catch (error) {
    console.error("Test attempt API error:", error);
    res.status(500).json({ error: "Failed to submit test" });
  }
}

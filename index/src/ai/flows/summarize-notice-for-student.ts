'use server';
/**
 * @fileOverview Summarizes a notice for students, providing a concise overview of the key information.
 *
 * - summarizeNoticeForStudent - A function that summarizes a given notice.
 * - SummarizeNoticeForStudentInput - The input type for the summarizeNoticeForStudent function.
 * - SummarizeNoticeForStudentOutput - The return type for the summarizeNoticeForStudent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoticeForStudentInputSchema = z.object({
  noticeContent: z
    .string()
    .describe('The full text content of the notice to be summarized.'),
});
export type SummarizeNoticeForStudentInput = z.infer<typeof SummarizeNoticeForStudentInputSchema>;

const SummarizeNoticeForStudentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key information in the notice.'),
});
export type SummarizeNoticeForStudentOutput = z.infer<typeof SummarizeNoticeForStudentOutputSchema>;

export async function summarizeNoticeForStudent(input: SummarizeNoticeForStudentInput): Promise<SummarizeNoticeForStudentOutput> {
  return summarizeNoticeForStudentFlow(input);
}

const summarizeNoticePrompt = ai.definePrompt({
  name: 'summarizeNoticePrompt',
  input: {schema: SummarizeNoticeForStudentInputSchema},
  output: {schema: SummarizeNoticeForStudentOutputSchema},
  prompt: `You are an assistant that summarizes notices for students.

  Summarize the following notice, extracting the key information and making it easy to understand quickly.

  Notice:
  {{noticeContent}}`,
});

const summarizeNoticeForStudentFlow = ai.defineFlow(
  {
    name: 'summarizeNoticeForStudentFlow',
    inputSchema: SummarizeNoticeForStudentInputSchema,
    outputSchema: SummarizeNoticeForStudentOutputSchema,
  },
  async input => {
    const {output} = await summarizeNoticePrompt(input);
    return output!;
  }
);

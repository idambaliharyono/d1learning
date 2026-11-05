import { z } from 'zod';

export const clientSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(10),
	fullName: z.string().trim().min(1, 'Full name required').max(100),
	gender: z.enum(['male', 'female'], 'Select a gender'),
	birthDate: z.iso.date('Birth date is required'),
	whatsapp: z
		.string()
		.trim()
		.min(1, 'whatsapp number required')
		.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid WhatsApp/phone number format'), // Validates E.164 phone formats
	photo: z
		.instanceof(File)
		.refine((f) => f.size <= 5_000_000, 'Max 5MB')
		.refine((f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type), 'Must be an image')
		.optional()
});

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendEmail(
	to: string,
	subject: string,
	text: string,
	html: string,
	imageUrl: string
) {
	const mailOptions = {
		from: "Movies World",
		to,
		subject,
		text,
		html,
	};
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		return info;
	} catch (error) {
		console.error("Error enviando correo ", error);
		throw error;
	}
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "moviesworldandmuchmore@gmail.com",
		pass: import.meta.env.VITE_EMAIL_NODEMAILER_APP,
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

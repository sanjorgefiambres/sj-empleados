const nodemailer = require('nodemailer');
const twilio = require('twilio');

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean);
const ADMIN_WHATSAPP = (process.env.ADMIN_WHATSAPP_NUMBERS || '').split(',').map(s=>s.trim()).filter(Boolean);

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || '';

let transporter = null;
if(SMTP_HOST && SMTP_USER){
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

let twilioClient = null;
if(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN){
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

async function sendEmail(to, subject, html){
  if(!transporter){
    console.log('Email transporter not configured. Skipping email to', to);
    return;
  }
  const info = await transporter.sendMail({
    from: SMTP_USER,
    to,
    subject,
    html
  });
  console.log('Email sent:', info.messageId, 'to', to);
}

async function sendWhatsApp(toNumber, body){
  if(!twilioClient || !TWILIO_WHATSAPP_FROM){
    console.log('Twilio not configured. Skipping WhatsApp to', toNumber);
    return;
  }
  const msg = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${toNumber}`,
    body
  });
  console.log('WhatsApp sent:', msg.sid, 'to', toNumber);
}

async function notify({ employee, type, data }){
  const fullName = employee ? `${employee.first_name} ${employee.last_name}` : 'Empleado';
  const subjectMap = {
    sanction: 'Notificación de sanción / apercibimiento',
    payslip: 'Nuevo recibo de sueldo disponible',
    lost_presentismo: 'Pérdida de presentismo'
  };
  const textMap = {
    sanction: `Se ha registrado una sanción para ${fullName}: Tipo: ${data.type}. Motivo: ${data.reason || 'No informado'}.`,
    payslip: `Se ha subido un nuevo recibo de sueldo para ${fullName}, periodo ${data.period_start} a ${data.period_end}.`,
    lost_presentismo: `Se ha detectado pérdida de presentismo para ${fullName} en el periodo ${data.period_start} a ${data.period_end}. Razón: ${data.reason || 'Reglas internas'}`
  };
  const subject = subjectMap[type] || 'Notificación';
  const body = textMap[type] || JSON.stringify(data);

  if(employee && employee.email){
    try{ await sendEmail(employee.email, subject, `<p>${body}</p>`); }catch(e){ console.error('Error sending email to employee', e); }
  } else { console.log('No employee email to notify.'); }

  for(const adminEmail of ADMIN_EMAILS){
    try{ await sendEmail(adminEmail, `[ADMIN] ${subject}`, `<p>${body}</p>`); }catch(e){ console.error('Error sending email to admin', e); }
  }

  if(employee && employee.phone){
    try{ await sendWhatsApp(employee.phone, body); }catch(e){ console.error('Error sending WhatsApp to employee', e); }
  } else { console.log('No employee phone for WhatsApp.'); }

  for(const adminPhone of ADMIN_WHATSAPP){
    try{ await sendWhatsApp(adminPhone, `[ADMIN] ${body}`); }catch(e){ console.error('Error sending WhatsApp to admin', e); }
  }
}

module.exports = { notify };

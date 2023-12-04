const emailTemplate = (action, otpCode) => {
  return `<html>
            <head>
              <style>
               @import url('https://fonts.cdnfonts.com/css/sf-pro-display');

   * {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
       color: #1E1E1E;
       font-family: 'SF Pro Display', sans-serif;
   }

   body {
       width: 100vw;
   }

   p {
       font-size: 14px;
   }

   img {
       height: 32px;
   }

   section {
       width: 100%;
       padding: 48px;
       background-color: #47B8B2;
   }

   section>div {
       width: 75%;
       margin: 0 auto;
       padding: 48px 24px;
       border-radius: 12px;
       background-color: #FFF
   }

   .header {
       display: grid;
       gap: 24px;
       margin-top: 40px;
   }

   .header>h1 {
       margin-bottom: 14px;
       font-size: 20px;
       font-weight: 800;
   }

   .code {
       display: flex;
       justify-content: center;
       align-items: center;
       margin: 48px 0;
       width: 100%;
       padding: 12px;
       background-color: #E6EBF0;
   }

   .code > p {
       width: 100%;
       text-align: center;
       letter-spacing: 8px;
       font-size: 24px;
       font-weight: 800;
   }

   .footer {
       display: grid;
       gap: 24px;
       margin-top: 80px;
       ;
   }

   .footer > h2 {
       margin-bottom: 8px;
       font-size: 18px;
       font-weight: 800;
   }

   @media screen and (max-device-width: 767px),
   screen and (max-width: 767px) {
       img {
           height: 24px;
       }

       section {
           padding: 0;
       }

       section>div {
           width: 100%;
           padding: 24px;
           border-radius: 0;
       }
   }
              </style>
            </head>
           <body>
      <section>
        <div>
          <img src="https://res.cloudinary.com/debe9q66f/image/upload/v1699021621/uniid_mainlogo_tsvwmk.png" alt="Logo" />

          <div class="header">
             <h2>Good Day!</h2>
            <p>
              A ${action} attempt requires further verification. To complete the verification
            ${action}, enter the verification code: ${otpCode}.
            </p>
          </div>

        <div class="code">
          <p>${otpCode}</p>
        </div>

          <div>
            <p>
              This email was generated because of a password ${action} attempt
              from the Uniid app.
            </p>
            <br />
          
          <p>
            The one-time passcode is necessary to finish the ${action}. So that
            you could access your account.
          </p>
          <br />
           
             <p>
            Please ignore this email if you are not trying to ${action} your
            account password.
          </p>
          </div>

          <div class="footer">
            <b>Kind regards,</b>
          <p>UniID Mailer</p>
          </div>
        </div>
      </section>
    </body>
          </html>`;
};

export default emailTemplate;

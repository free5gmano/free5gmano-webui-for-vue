const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

console.log(SimpleWebAuthnBrowser);

// Registration

// Authentication

/**
 * Helper methods
 */

// function printToDebug(elemDebug, title, output) {
//   if (elemDebug.innerHTML !== "") {
//     elemDebug.innerHTML += "\n";
//   }
//   elemDebug.innerHTML += `// ${title}\n`;
//   elemDebug.innerHTML += `${output}\n`;
// }

// function resetDebug(elemDebug) {
//   elemDebug.innerHTML = "";
// }

// function printToStatus(elemStatus, output) {
//   elemStatus.innerHTML = output;
// }

// function resetStatus(elemStatus) {
//   elemStatus.innerHTML = "";
// }

// function getPassStatus() {
//   return "註冊成功";
// }

// function getPassStatus2() {
//   return "驗證成功";
// }

// function getFailureStatus(message) {
//   return `失敗 (Reason: ${message})`;
// }

/**
 * Register Button
 */
async function register() {
  console.log("我在註冊");
  // const statusRegister = document.getElementById("statusRegister");
  // const dbgRegister = document.getElementById("dbgRegister");
  // resetStatus(statusRegister);
  // resetDebug(dbgRegister);

  // Get options
  const resp = await fetch(
    "http://localhost:5000/generate-registration-options"
  );
  const opts = await resp.json();
  // // printToDebug(
  //   dbgRegister,
  //   "Registration Options",
  //   JSON.stringify(opts, null, 2)
  // );

  // Start WebAuthn Registration
  let regResp;
  try {
    regResp = await startRegistration(opts);
    // printToDebug(dbgRegister, "測試測試", JSON.stringify(regResp, null, 2));
  } catch (err) {
    // printToStatus(statusRegister, getFailureStatus(err));
    throw new Error(err);
  }

  // console.log(regResp);
  // console.log(JSON.stringify(regResp));

  // Send response to server
  const verificationResp = await fetch(
    "http://localhost:5000/verify-registration-response",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regResp),
    }
  );

  // Report validation response
  const verificationRespJSON = await verificationResp.json();
  console.log(verificationRespJSON);
  const { verified, msg } = verificationRespJSON;
  // if (verified) {
  //   printToStatus(statusRegister, getPassStatus());
  // } else {
  //   printToStatus(statusRegister, getFailureStatus());
  // }
  // printToDebug(
  //   dbgRegister,
  //   "Verification Response",
  //   JSON.stringify(verificationRespJSON, null, 2)
  // );
}
// document
//   .getElementById("btnRegister")
//   .addEventListener("click", async () => {});

/**
 * Authenticate Button
 */
async function authenticate() {
  console.log("我在驗證");
  // const statusAuthenticate = document.getElementById("statusAuthenticate");
  // const dbgAuthenticate = document.getElementById("dbgAuthenticate");

  // resetStatus(statusAuthenticate);
  // resetDebug(dbgAuthenticate);

  // Get options
  const resp = await fetch(
    "http://localhost:5000/generate-authentication-options"
  );
  const opts = await resp.json();
  // printToDebug(
  //   dbgAuthenticate,
  //   "Authentication Options",
  //   JSON.stringify(opts, null, 2)
  // );

  // Start WebAuthn Authentication
  let authResp;
  try {
    authResp = await startAuthentication(opts);
    // printToDebug(
    //   dbgAuthenticate,
    //   "Authentication Response",
    //   JSON.stringify(authResp, null, 2)
    // );
  } catch (err) {
    // printToStatus(statusAuthenticate, getFailureStatus(err));
    throw new Error(err);
  }

  // Send response to server
  const verificationResp = await fetch(
    "http://localhost:5000/verify-authentication-response",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authResp),
    }
  );

  // Report validation response
  const verificationRespJSON = await verificationResp.json();
  const { verified, msg } = verificationRespJSON;
  // if (verified) {
  //   printToStatus(statusAuthenticate, getPassStatus2());
  // } else {
  //   printToStatus(statusAuthenticate, getFailureStatus(err));
  // }
  // printToDebug(
  //   dbgAuthenticate,
  //   "Verification Response",
  //   JSON.stringify(verificationRespJSON, null, 2)
  // );
}
// document
//   .getElementById("btnAuthenticate")
//   .addEventListener("click", async () => {});

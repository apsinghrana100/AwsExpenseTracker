// email-id: <input type="text" name="Emaild" id="email-id">
// <input type="button" value="Change-passWord" id="email-id" /> 
// <input type="button" value="Cancel">
const message=document.getElementById("message");


const passWordbtn=document.getElementById('Change-passWord');

passWordbtn.addEventListener('click',forgetpassword);

async function forgetpassword(event)
{
    console.log("I am forgetPassword js");
    const Emaild=document.getElementById('email-id').value;
    const obj={
        Emaild
    };  
    try {
       const userid=await axios.post(`http://localhost:4000/changepassword`,obj);
       if(userid){
        message.innerHTML="<h1>Reset Password link sent Successfully</h1>";
        passWordbtn.disabled =true;
       }
       
       console.log(userid);
        console.log(userid.data.Userid);
        localStorage.setItem("forgetuserid",userid.data.Userid);
    } catch (error) {
        console.log(error);
    }
  
}

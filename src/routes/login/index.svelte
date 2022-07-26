<script context="module">
  export async function load({ session }) {
    try {

      if(session){
        return {
          status: 302,
          redirect: "/main"
        }
      }

        return {
          status: 202
        }
      
    } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
    }
  }
</script> 


<script>
  
  import PageTransitions from '../../components/PageTransitions.svelte';
  import {notifications} from '$lib/notifications.js'
	import Toast from '../../components/Toast.svelte'

  async function onSubmit(e) {
    
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    const res = await fetch('/login.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
      method: 'POST',
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((data) => {
        if(data.state === "success"){
          notifications.success('Přihlášení proběhlo úspěšně', 1000)
          window.location.href = "/main";
        } else if((data.state === "failed")){
          notifications.warning('Uživatel neexistuje', 1000)
        }
      })
    }


</script>

<svelte:head>
	<title>ToDo app - login</title>
</svelte:head>

<PageTransitions>
<h1>
  ToDo
  <span>
    app
  </span>
</h1>

<h2>
  Přihlášení do aplikace
</h2>

<form on:submit|preventDefault={onSubmit}>
  <fieldset>
    <label for="login">Login</label>
    <input type="text" name="login" placeholder="Zadej login">
  </fieldset>
  <fieldset>
    <label for="password">Password</label>
    <input type="password" name="password" placeholder="Zadej heslo">
  </fieldset>

    <button>Přihlásit se</button>
    <a href="/registration" class="registration">Registrovat se</a>


</form>


<Toast />
</PageTransitions>

<style lang="scss">

  h1{
    color:white;
    margin-top: 0;
    font-size: 80px;
    text-align: center;
    line-height: 60px;
    margin-bottom: 0;
    
    span{
      font-size: 40px;
      display: block;
      padding-left: 115px;
    }
  }

  h2{
    color: white;
    text-align: center;
    font-size: 16px;
    opacity: 0.5;
    margin-bottom:25px;
  }

  .registration{
   text-align: center;
   color:white;
   display: block;
   text-decoration: none;
   font-weight: bold;
   font-size: 14px;
   margin-top: 20px;
  }

    fieldset{
      border: 0;
      padding-left: 0;
      padding-right: 0;
    }
      label{
        font-weight: bold;
        color: white;
        font-size: 13px;
        display: block;
        opacity: .5;
        padding: 0px 15px 10px;
      }

      input{
        background-color: #273666;
        border-radius: 18px;
        padding: 20px 30px;
        border: 0;
        width: 100%;
        color: white;
        font-weight: bold;
      }

      ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: white;
      opacity: 1; /* Firefox */
      font-weight: bold;
      }

      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: white;
        font-weight: bold;
      }

      ::-ms-input-placeholder { /* Microsoft Edge */
        color: white;
        font-weight: bold;
      }


    button {
      background-color: #046AFF;
      font-size: 14px !important;
      color: white;
      font-weight: bold;
      padding: 18px 30px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      -moz-box-shadow: 0px 0px 30px 0px rgb(4 106 255 / 10%);
      box-shadow: 0px 0px 30px 0px rgb(4 106 255 / 10%);
      border: 0;
      margin: 10px auto;
    }
 
</style>
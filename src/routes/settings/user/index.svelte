<script context="module">
  export async function load({ fetch, session }) {
    try {
      const response = await fetch(`/settings/user.json`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
      }); // stored in static folder
      const { getUser } = await response.json();
          
      if(!session){
        return {
          status: 302,
          redirect: "/login"
        }
      }

      return {
        props: {
          getUser
        }
      }
    } catch (err) {
    // 👇️ This runs
    
    if(!session){
        return {
          status: 302,
          redirect: "/login"
        }
    }

    console.log('Error: ', err.message);
    }
  }
</script> 

<script>

  import PageTransitions from '../../../components/PageTransitions.svelte';
  import BackButton from '../../../components/BackButton.svelte';
  import {notifications} from '$lib/notifications.js'
  import { goto } from "$app/navigation";
	import Toast from '../../../components/Toast.svelte'

  export let getUser = [];
         let firstName = getUser[0]?.name ? getUser[0]?.name : "Zadej jméno"
         let lastName = getUser[0]?.lastname ? getUser[0]?.lastname : "Zadej příjmení"

  async function onSubmit(e) {
    
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    
    const res = await fetch('/settings/user.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
      method: 'PUT',
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((data) => {
        if(data.state === "success"){
              notifications.success('Uloženo', 1000)
              goto("/settings")
        } 
    })
  }
  

</script>

<svelte:head>
	<title>ToDo app - edit user</title>
</svelte:head>

<PageTransitions>
<BackButton link="/settings" />

  <form on:submit|preventDefault={onSubmit}>

    <legend>
      Nastavení<br>
      profilu
    </legend> 
    <fieldset>
      <label for="name">Jméno</label>
      <input type="text" name="name" placeholder="Zadej jméno" value={firstName} >
    </fieldset>
    <fieldset>
      <label for="lastname">Příjmení</label>
      <input type="text" name="lastname" placeholder="Zadej příjmení" value={lastName} >
    </fieldset>


  <div class="bg-button">
    <button>Uložit</button>
  </div>
  </form>
  
  <Toast />
</PageTransitions>

<style lang="scss">
  form{
    padding-bottom:70px;

    legend{
      font-size: 30px;
      font-weight: bold;
      color: white;
      padding-bottom: 30px;
    }
    
    fieldset{
      border: 0;
      padding-left: 0;
      padding-right: 0;
      margin: 0;

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
    }

    .bg-button{
      position: fixed;
      bottom: 0; 
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(180deg, rgba(19,31,83,0) 0%, rgba(19,31,83,1) 100%);
      padding: 25px 0px 30px 0px;
      width: 100%;
      text-align: center;

      button {
        background-color: #046AFF;
        font-size: 14px !important;
        color: white;
        font-weight: bold;
        padding: 18px 30px;
        border-radius: 18px;
        -moz-box-shadow: 0px 0px 30px 0px rgb(4 106 255 / 10%);
        box-shadow: 0px 0px 30px 0px rgb(4 106 255 / 10%);
        border: 0;
      }
    }
  }
</style>

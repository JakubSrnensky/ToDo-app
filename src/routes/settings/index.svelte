<script context="module">
  export async function load({ fetch, session }) {
    try {
      const response = await fetch(`/settings.json`); // stored in static folder
   
      
      if(!session){
        return {
          status: 302,
          redirect: "/login"
        }
      }

      const { getUser } = await response.json();
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

  import PageTransitions from '../../components/PageTransitions.svelte';
  import BackButton from '../../components/BackButton.svelte';
	import Toast from '../../components/Toast.svelte'
  import Fa from 'svelte-fa'
  import {notifications} from '$lib/notifications.js'
  import { faGears, faFile, faDoorOpen, faPencil } from '@fortawesome/free-solid-svg-icons'
 
  export let getUser

  
  async function deleteCookie(e) {

        const res = await fetch('/settings.json', {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          method: 'DELETE',
          body: JSON.stringify(e)
        }).then((response) => response.json())
          .then((data) => {
            if(data.state === "success"){
              notifications.success('Odhlášení bylo úspěšné', 1000)
              window.location.href = "/login";
            }
            
        })
    }

  
</script>

<svelte:head>
	<title>ToDo app - settings</title>
</svelte:head>

<PageTransitions>
  <BackButton link="/main" />
  
    {#if getUser[0].name}
    <h1>
      {getUser[0].name}<br>
      {getUser[0].lastname}
    </h1>
    {:else}
      <a href="/settings/user" class="empty-name"><Fa icon={faPencil} size="sm" style="margin-right:5px;" /> Zadej jméno a příjmení</a>
    {/if}


    
  <nav>
    <ul>
      <li><a href="/settings/categories/"><span><Fa icon={faFile} size="sm" style="margin-right:5px;" /></span> Categories</a></li>
      <li><a href="/settings/user/"><span><Fa icon={faGears} size="sm" style="margin-right:5px;" /></span> Settings</a></li>
      <li><button on:click={deleteCookie}><span><Fa icon={faDoorOpen} size="sm" style="margin-right:5px;" /></span> Logout</button></li>
    </ul>
  </nav>

  <Toast />
</PageTransitions>


<style lang="scss">

  h1{
    color:white;
    margin-top: 0;
    font-size: 30px;
  }

  .empty-name{
    background-color: red;
    color: white;
    display: inline-block;
    padding: 5px 10px;
    border-radius: 18px;
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
  }

  
  nav {
    ul{
      list-style: none;
      padding: 0;

      li{
        a{
          color:white;
          text-decoration: none;
          margin: 7px 0px;
          display: inline-block;
          font-size: 15px;
          font-weight: bold;
          opacity: 0.7;
        }

        button{
          border: 0;
          background-color: transparent;
          color:white;
          text-decoration: none;
          margin: 7px 0px;
          display: inline-block;
          font-size: 15px;
          padding: 0;
          font-weight: bold;
          opacity: 0.7;
        }

        span{
          width: 20px;
          display: inline-block;
        }
      }
    }
  }

</style>
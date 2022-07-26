<script context="module">
  export async function load({ fetch, session }) {
    try {
      const response = await fetch(`/settings/categories.json`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }); // stored in static folder
      const { categoryData } = await response.json();
      
      if(!session){
        return {
          status: 302,
          redirect: "/login"
        }
      }
      
      return {
        props: {
          categoryData
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
  import Categories from "../../../components/Categories.svelte"
  import Fa from 'svelte-fa'
  import { faXmark } from '@fortawesome/free-solid-svg-icons'
  import {notifications} from '$lib/notifications.js'
	import Toast from '../../../components/Toast.svelte'


  export let categoryData = []
         let color = "dark";

    async function onSubmit(e) {
    
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    const res = await fetch('/settings/categories.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
      method: 'POST',
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((data) => {
        if(data.state === "success"){
              notifications.success('Kategorie byla vytvořena', 2000)
        } else if((data.state === "failed")){
          notifications.warning('Kategorie již existuje', 2000)
        }
        categoryData = data.categoryData
    })
  }

  
    async function deleteItem(item) {
      if(item.todos.length === 0){
        const res = await fetch('/settings/categories.json', {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          method: 'DELETE',
          body: JSON.stringify({
            id: item._id
          })
        }).then((response) => response.json())
          .then((data) => {
           
            if(data.state === "success"){
              notifications.success('Kategorie byla smazána', 1000)
            } 
            categoryData = data.categoryData
        })
      } else {
        notifications.warning('Kategorie obsahuje aktivní tásky', 1000)
      }
    }

  

 
</script>

<svelte:head>
	<title>ToDo app - categories</title>
</svelte:head>

<PageTransitions>
  <BackButton link="/settings" />

  <h1>
    Create<br>
    categories
  </h1>
  <form on:submit|preventDefault={onSubmit}>
    <fieldset>
      <label for="nameCategory">Název kategorie</label>
      <input type="text" name="nameCategory" placeholder="Zadej název kategorie">
    </fieldset>
    <fieldset>
      <label for="colorCategory">Vyber barvu kategorie</label>
      <input type="color" name="colorCategory" value="#D9D900">
    </fieldset>
    <button>Uložit kategorii</button>
  </form>


  

  <h2>
    Kategorie
  </h2>

    {#await categoryData}
      <p>...waiting</p>
    {:then}
      <div class="categories-wrapper">
        {#if categoryData}
     
        {#each categoryData as item}
  
          <div class="category-wrapper">
            <Categories {color} nameCategory={item.nameCategory} colorCategory={item.colorCategory} numberOfTask={item.todoCount}/>
            <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
          </div>
      
        {/each}
   
        {/if}
        {#if categoryData.length === 0}
          <span class="no-category">Nemáš vytvořené žádné kategorie</span>
        {/if}
      </div>
    {/await}

    <Toast />
</PageTransitions>

  
<style lang="scss">
  
  h1{
    color:white;
    margin-top: 0;
    font-size: 30px;
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

      input[type="text"]{
        background-color: #273666;
        border-radius: 18px;
        padding: 20px 30px;
        border: 0;
        width: 100%;
        color: white;
        font-weight: bold;
      }

      input[type="color"] {
        -webkit-appearance: none;
        border: none;
        width: 32px;
        height: 32px;
      }
      
      input[type="color"] {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: none;
        border: 0;
        cursor: pointer;
        height: 55px;
        padding: 0;
        width: 100%;
        border-radius: 18px;
        overflow: hidden;
      }

      *:focus{
        outline: none;
      }

      ::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      ::-webkit-color-swatch{
        border: 0;
        border-radius: 0;
      }

      ::-moz-color-swatch,
      ::-moz-focus-inner{
        border: 0;
      }

      ::-moz-focus-inner{
        padding: 0;
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

    h2{
      color: white;
    }

    .categories-wrapper{
      display: flex;
      flex-wrap: wrap;
      column-gap: 10px;
      row-gap: 10px;

      .no-category{
        font-weight: 500;
        color: white;
        font-size: 14px;
      }

      .category-wrapper{
        position: relative;
        width: calc(20% - 10px);

        @media all and (max-width: 1024px) {
          width: calc(25% - 10px);
        }

        @media all and (max-width: 767px) {
          width: calc(33% - 10px);
        }

        @media all and (max-width: 560px) {
          width: calc(50% - 10px);
        }

        @media all and (max-width: 460px) {
          width: calc(100% - 10px);
        }

        .delete-category{
          position: absolute;
          top: 8px;
          right: 9px;
          background-color: red;
          width: 17px;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          border-radius: 100px;
          color: #0C1B45;
        }
      }
    }
 
</style>
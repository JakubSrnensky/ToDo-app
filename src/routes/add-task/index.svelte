<script context="module">
  export async function load({ fetch, session }) {
    try {
      const response = await fetch(`/add-task.json`, {
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

  import PageTransitions from '../../components/PageTransitions.svelte';
  import BackButton from '../../components/BackButton.svelte';
  import {notifications} from '$lib/notifications.js'
	import Toast from '../../components/Toast.svelte'
  import { goto } from "$app/navigation";
  
  export let color = "dark";
  export let categoryData = []
         let selectedCategory;
         let dateToday = new Date().toISOString().slice(0, 10)

  async function onSubmit(e) {
    
    const formData = new FormData(e.target);
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }


    //save date to timestamp DB
    const dateTask = new Date(data.dateTask);

    const timestampDateTask = dateTask.getTime();

    const res = await fetch('/add-task.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },
      method: 'POST',
      body: JSON.stringify({
          descriptionTask: data.descriptionTask,
          categoryId: data.select,
          nameCategory: data.name,
          dateTask: timestampDateTask
        })
    }).then((response) => response.json())
      .then((data) => {
        if(data.state === "success"){
          notifications.success('Task byl úspěšně přidán', 1000)
        }
        goto("/main")
      })
    }


</script>

<svelte:head>
	<title>ToDo app - add task</title>
</svelte:head>

<PageTransitions>
  <BackButton link="../main" {color}/>

    <h1>
      Přidat task
    </h1>
      
    <form on:submit|preventDefault={onSubmit}>
  
   
      <fieldset>
        <textarea name="descriptionTask" placeholder="Popisek tasku"/>
      </fieldset>

      <fieldset> 
        <select name="select" class="choose-category" bind:value={selectedCategory}>
            <option value="">
              Vyber kategorii
            </option>
            {#each categoryData as itemCategory}
              <option value={itemCategory._id}>
                <i class="color" style="background-color:{itemCategory.colorCategory};"></i> {itemCategory.nameCategory}
              </option>
            {/each}
        </select>
      </fieldset>

      <fieldset class="date-wrapper">
        <label for="start">Start date:</label>
        <input type="date" name="dateTask" value={dateToday}>
      </fieldset>



      <button class="save">Uložit</button>
  
    </form>

    <Toast />
  </PageTransitions>

<style lang="scss">

  h1{
    font-size: 20px;
    font-weight: 500;
  }

  form{
    height: 50vh;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    fieldset{
      border: 0;
      padding: 0;
      width: 100%;
    }

    .date-wrapper{
      text-align: center;
      padding-top: 20px;

      label{
        font-weight: 500;
        font-size: 14px;
      }

      input{
        border: 2px solid rgb(31, 51, 110, 0.4);
        border-radius: 18px;
        padding: 5px;
      }
    }

    textarea{
      width: 100%;
      border: 0;
      outline: none;
      color: #7580AA;
      font-size: 20px;
      max-height: 100px;
      overflow: auto;
      display: block;
      padding: 10px 15px;
    }

    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #7580AA;
      opacity: 1; /* Firefox */
      font-size: 20px;
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #7580AA;
      font-size: 20px;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
      color: #7580AA;
      font-size: 20px;
    }
  }

  button  {
    color: white;
    border: 0;

    &.add  {
    position: absolute;
    bottom: 30px;
    right: 30px;
    background-color: #EB06FF;
    border-radius: 18px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    -moz-box-shadow: 0px 0px 20px 0px rgb(235 6 255 / 50%);
    box-shadow: 0px 0px 20px 0px rgb(235 6 255 / 50%);
    font-size: 25px;
    }

    &.save{
      background-color: #046AFF;
      -moz-box-shadow: 0px 2px 20px 0px rgb(4 106 255 / 40%);
      box-shadow: 0px 2px 20px 0px rgb(4 106 255 / 40%);
      font-size: 15px;
      border-radius: 100px;
      padding: 16px 40px;
      position:absolute;
      bottom: 30px;
      right: 30px;
    }
  }

  .choose-category{
    border: 2px solid rgba(31, 51, 110, 1);
    padding: 9px 15px;
    border-radius: 18px;
    font-weight: 500;
    font-size: 15px;
    width: 100%;
    margin-top: 10px;
  }

</style>
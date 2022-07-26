<script context="module">
  export async function load({ fetch, session }) {
    try {
     
      const response = await fetch(`/main.json`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }); // stored in static folder

  
      if(!session){
        return {
          redirect: "/login",
          status: 302
        }
      }
      
      const { categoryData, dataCategoryTodo, getUser, numberTasks } = await response.json();

      
      return {
        props: {
          categoryData,
          dataCategoryTodo,
          getUser,
          numberTasks
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
  import Burger from './components/Burger.svelte';
  import Button from '../../components/Button.svelte';
  import Tasks from '../../components/Tasks.svelte';
  import Fa from 'svelte-fa'
  import { faXmark } from '@fortawesome/free-solid-svg-icons'
  import { fade } from 'svelte/transition';
  import { Navigation, A11y } from 'swiper';
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import 'swiper/css';
  import 'swiper/css/navigation';

  export let message = null;
  export let state = null;
  export let getUser = []
  export let dataCategoryTodo = []
  export let categoryData = []
  export let numberTasks;
         let nameCategory = null;
         let colorCategory = null;
         let categoriesSorting = null;
         $: dataCategoryTodo = dataCategoryTodo.sort((x, y) => +new Date(x.dateTask) - +new Date(y.dateTask));
         
         //today date
         let todayDate = new Date().valueOf();

         //yesterdy date
         let todayYesterday = new Date()
         let yesterdayTimestamp = new Date(todayYesterday)
         let yesterday = new Date(yesterdayTimestamp.setDate(yesterdayTimestamp.getDate() - 1));

         //tomorrow
         let today = new Date()
         let tomorrowTimestamp = new Date(today)
         let tomorrow = new Date(tomorrowTimestamp.setDate(tomorrowTimestamp.getDate() + 1));


         //week
         let week = new Date()
         let weekTimestamp = new Date(week)
         let weekResult = new Date(weekTimestamp.setDate(weekTimestamp.getDate() + 7));
         

    async function deleteItem(item) {

        const res = await fetch('/main.json', {
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
            message = data.message
            state = data.state
            console.log(data)
            categoryData = data.categoryData
            dataCategoryTodo = data.dataCategoryTodo.sort((x, y) => +new Date(x.dateTask) - +new Date(y.dateTask));  
 
              categoryData.forEach((el) => {
                if(el._id === item.categoryId){
                  categoriesSorting = el.todos.sort((x, y) => +new Date(x.dateTask) - +new Date(y.dateTask));
                }
              })
              
        })
    }


    async function deleteAll(item) {

        const res = await fetch('/main.json', {
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
            message = data.message
            state = data.state
            categoryData = data.categoryData
            dataCategoryTodo = data.dataCategoryTodo.sort((x, y) => +new Date(x.dateTask) - +new Date(y.dateTask));   
        })
    }


    async function showCategory(item) {

      categoryData.forEach((el) => {
        
        if(el.nameCategory === item.nameCategory){
          categoriesSorting = el.todos.sort((x, y) => +new Date(x.dateTask) - +new Date(y.dateTask));
          nameCategory = el.nameCategory
          colorCategory = el.colorCategory
        }
      })
      
    }

    async function showAll() {
      categoriesSorting = null
    }
    
    
</script>

<svelte:head>
	<title>ToDo app</title>
</svelte:head>

  <PageTransitions>
    <Burger />
      <h1>What´s, up
        {#if getUser[0]?.name}
          <br>{getUser[0]?.name}
        {/if}
      </h1>
     
      <h2>
        Kategorie
      </h2>

      {#await categoryData}
        <p>...waiting</p>
      {:then}
      <div class="categories--wrapper">
 
          <Swiper
          modules={[Navigation, A11y]}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          class="mySwiper"
        >

        <div class="swiper-slide">
          <div class="category" on:click={showAll}>
            <span class="number-task">počet všech tásků {numberTasks}</span>
            <h3>Všechny tásky zobrazit</h3>
          </div>
        </div>
        {#each categoryData as item}
        <SwiperSlide>
            <div class="category" on:click={() => showCategory(item)}>
              <span class="number-task">počet tásků {item.todoCount}</span>
              <h3>{item.nameCategory}</h3>
              <hr style="background-color:{item.colorCategory};">
            </div>
          </SwiperSlide>
        {/each}
      </Swiper>
      </div>
      {/await}


      {#if categoriesSorting}
      <div class="todos--wrapper">
        <h2>
          {nameCategory}
        </h2>

        <h3>
          Prošlé úkoly
        </h3>
        {#each categoriesSorting as item}
          {#if yesterday > item.dateTask}
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={nameCategory}
                colorCategory={colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.categoryId}
                taskId={item._id}
              />
                <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
            
            </div>
         {/if}
        {/each}

        <h3>
          Dnešní úkoly
        </h3>
        {#each categoriesSorting as item}
          {#if yesterday < item.dateTask && today > item.dateTask}
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={nameCategory}
                colorCategory={colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.categoryId}
                taskId={item._id}
              />
                <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
            
            </div>
         {/if}
        {/each}

        <hr>
        <h3>
          Zítřejší úkoly
        </h3>
        {#each categoriesSorting as item}
          {#if todayDate < item.dateTask && tomorrow > item.dateTask }
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={nameCategory}
                colorCategory={colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.categoryId}
                taskId={item._id}
              />
                <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
            
            </div>
          {/if}
        {/each}

        <hr>
        <h3>
          Úkoly na další týden
        </h3>
        {#each categoriesSorting as item}
          {#if tomorrow < item.dateTask && weekResult > item.dateTask }
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={nameCategory}
                colorCategory={colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.categoryId}
                taskId={item._id}
              />
              
                <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
            
            </div>
          {/if}
        {/each}

        <hr>
        <h3>
          Úkoly za týden
        </h3>
        {#each categoriesSorting as item}
          {#if weekResult < item.dateTask}
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={nameCategory}
                colorCategory={colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.categoryId}
                taskId={item._id}
              />
                <span class="delete-category" on:click={() => deleteItem(item)}><Fa icon={faXmark} /></span>
            
            </div>
          {/if}
        {/each}

      </div>
      {/if}

    
      {#if !categoriesSorting}
      <h2>
        Přehled všech tásků
      </h2>
      {#if dataCategoryTodo.length === 0}
        <strong>Nyní nemáš žádný úkol</strong>
      {/if}
      {#await dataCategoryTodo }
        <p>...waiting</p>
      {:then}
      <div class="todos--wrapper">

        <h3>
          Prošlé úkoly
        </h3>
        {#each dataCategoryTodo as item}
          {#if yesterday > item.dateTask}
            <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
           
              <Tasks 
                descriptionTask={item.descriptionTask} 
                nameCategory={item.category.nameCategory}
                colorCategory={item.category.colorCategory}
                timestampTask={item.dateTask}
                category={categoryData}
                selected={item.category._id}
                taskId={item._id}
              />

                <span class="delete-category" on:click={() => deleteAll(item)}><Fa icon={faXmark} /></span>
            
            </div>
          {/if}
        {/each}

        <hr>

          <h3>
            Dnešní úkoly
          </h3>
          {#each dataCategoryTodo as item}
            {#if yesterday < item.dateTask && today > item.dateTask}
              <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
             
                <Tasks 
                  descriptionTask={item.descriptionTask} 
                  nameCategory={item.category.nameCategory}
                  colorCategory={item.category.colorCategory}
                  timestampTask={item.dateTask}
                  category={categoryData}
                  selected={item.category._id}
                  taskId={item._id}
                />

                  <span class="delete-category" on:click={() => deleteAll(item)}><Fa icon={faXmark} /></span>
              
              </div>
            {/if}
          {/each}

          <hr>
          <h3>
            Zítřejší úkoly
          </h3>
          {#each dataCategoryTodo as item}
            {#if todayDate < item.dateTask && tomorrow > item.dateTask }
              <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
                <Tasks 
                  descriptionTask={item.descriptionTask} 
                  nameCategory={item.category.nameCategory}
                  colorCategory={item.category.colorCategory}
                  timestampTask={item.dateTask}
                  category={categoryData}
                  selected={item.category._id}
                  taskId={item._id}
                />
                
                  <span class="delete-category" on:click={() => deleteAll(item)}><Fa icon={faXmark} /></span>
              
              </div>
            {/if}
          {/each}

          <hr>
          <h3>
            Úkoly na další týden
          </h3>
          {#each dataCategoryTodo as item}
            {#if tomorrow < item.dateTask && weekResult > item.dateTask }
              <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
                <Tasks 
                  descriptionTask={item.descriptionTask} 
                  nameCategory={item.category.nameCategory}
                  colorCategory={item.category.colorCategory}
                  timestampTask={item.dateTask}
                  category={categoryData}
                  selected={item.category._id}
                  taskId={item._id}
                />
                
                  <span class="delete-category" on:click={() => deleteAll(item)}><Fa icon={faXmark} /></span>
              
              </div>
            {/if}
          {/each}

          <hr>
          <h3>
            Úkoly za týden
          </h3>
          {#each dataCategoryTodo as item}
            {#if weekResult < item.dateTask}
              <div class="task" in:fade="{{ opacity: 80, duration: 250, delay: 200 }}">
                <Tasks 
                  descriptionTask={item.descriptionTask} 
                  nameCategory={item.category.nameCategory}
                  colorCategory={item.category.colorCategory}
                  timestampTask={item.dateTask}
                  category={categoryData}
                  selected={item.category._id}
                  taskId={item._id}
                />
                
                  <span class="delete-category" on:click={() => deleteAll(item)}><Fa icon={faXmark} /></span>
              
              </div>
            {/if}
          {/each}

      </div>
      {/await}
      {/if}


	<Button nameButton="+ Add New activity" link="/add-task/" custom="add--task"/>

  </PageTransitions>

  

<style lang="scss">

  
  h2{
    font-size: 20px;
    padding: 10px 0;    
  }


  .categories--wrapper{
    display: flex;
    column-gap: 10px;
    margin-left: -30px;
    width: calc(100% + 60px);

      .category{
          background-color: white;
          border-radius: 18px;
          padding: 10px 10px 5px 10px;
          -webkit-box-shadow: 0px 0px 17px 7px rgba(230,234,255,0.8); 
          box-shadow: 0px 0px 17px 7px rgba(230,234,255,0.8);
          height: 80px;
          width: 140px;

          &.dark{
            box-shadow: none;
            background-color: #0C1B45;
            border: 2px solid #172768;

            h3{
              color: white;
            }
          }

          .number-task{
            color: #898FA6;
            font-weight: 500;
            font-size: 12px;
          }

          h3{
            margin: 2px 0px 7px;
            font-size: 15px;
            font-weight: 500;
          }

          hr{
            height: 3px;
            border-radius: 10px;
            border: 0;
          }
        }
  }

  .todos--wrapper{

    h3{
      font-size: 15px;
      font-weight: 500;
    }

    hr{
      opacity: 0.2;
      margin: 40px 0 30px;
    }

    .task{
      background-color: white;
      border-radius: 18px;
      padding: 10px 20px 7px 10px;
      -webkit-box-shadow: 0px 0px 17px 7px rgb(0 0 0 / 5%);
      box-shadow: 0px 0px 17px 7px rgb(0 0 0 / 5%);
      height: 65px;
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .delete-category{
        margin-left: auto;
        color: #0E1F55;
      }
    }

  }


</style>


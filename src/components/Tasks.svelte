<script>

  import Fa from 'svelte-fa'
  import { faPencil } from '@fortawesome/free-solid-svg-icons'

  export let descriptionTask = null
  export let nameCategory = null
  export let colorCategory = null
  export let timestampTask = null
  export let nameCategoryChange = null;
  export let taskId = null
          $: dateTask = new Date(timestampTask).toISOString().slice(0, 10); 
        


</script>



  <a href="/main/{taskId}"><Fa icon={faPencil} /></a>
  <div class="info-wrapper">
    <div class="task">
      {descriptionTask}  
      {dateTask}
    </div>
    <div class="category">
      <span class="dot" style="background-color:{colorCategory};"></span>
      {#if nameCategoryChange}
        {nameCategoryChange}
      {:else}
        {nameCategory}
      {/if}
    </div>
  </div>



<style lang="scss">

  a{
    font-size: 14px;
    margin-right: 10px;
    color:#0E1F55;
  }

  .info-wrapper{

    .task{
      font-weight: 500;
      display: block;
    }

    .category{
      font-weight: 500;
      font-size: 14px;
      color: gray;
      display: flex;
      align-items: center;

      .dot{
        width:7px;
        height:7px;
        display: inline-block;
        border-radius: 100%;
        margin-right: 5px;
      }
    }
  }

  
  form{
    height: 50vh;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    position: relative;

    fieldset{
      border: 0;
      padding: 0;
      width: 100%;
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

    .choose-category{
      border: 2px solid rgba(31, 51, 110, 1);
      padding: 9px 15px;
      border-radius: 18px;
      font-weight: 500;
      font-size: 15px;
      width: 100%;
      margin-top: 10px;
    }

    
      button  {
        color: white;
        border: 0;

        &.save{
          background-color: #046AFF;
          -moz-box-shadow: 0px 2px 20px 0px rgb(4 106 255 / 40%);
          box-shadow: 0px 2px 20px 0px rgb(4 106 255 / 40%);
          font-size: 15px;
          border-radius: 100px;
          padding: 16px 40px;
          position:absolute;
          bottom: 0px;
          right: -35px;
        }
      }

  }

  button{
    background: transparent;
    border: 0;
    color: #0E1F55;
  }

</style>
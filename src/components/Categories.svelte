<script>

 
  export let nameCategory = null;
  export let colorCategory = null;
  export let numberOfTask = null;
  export let color = "";

</script>



  <div class="category {color}">
    <span class="number-task">počet tásků {numberOfTask}</span>
    <h3>{nameCategory}</h3>
    <hr style="background-color:{colorCategory};">
  </div>

<style lang="scss">

  .category{
    background-color: white;
    border-radius: 18px;
    padding: 10px 10px 5px 10px;
    -webkit-box-shadow: 0px 0px 17px 7px rgba(230,234,255,0.8); 
    box-shadow: 0px 0px 17px 7px rgba(230,234,255,0.8);
    height: 80px;
    width: 100%;

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

</style>
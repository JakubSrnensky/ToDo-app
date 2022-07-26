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
          status: 302,
          redirect: "/login"
        }
      
    } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
    }
  }
</script> 



<svelte:head>
	<title>ToDo app</title>
</svelte:head>
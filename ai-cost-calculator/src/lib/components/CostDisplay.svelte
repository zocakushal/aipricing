<script lang="ts">
  export let cost: number = 0;
  const decimalPlaces = 5; // Or another number that makes sense for typical AI costs
</script>

<div>
  <h4>Calculated Cost:</h4>
  <p>${cost.toFixed(decimalPlaces)}</p>
</div>

<style>
  /* Add some basic styling if you wish */
  div {
    margin-top: 15px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  h4 {
    margin-top: 0;
  }
  p {
    font-size: 1.2em;
    font-weight: bold;
    color: #007bff; /* Or your preferred color */
  }
</style>

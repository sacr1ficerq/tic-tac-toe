<script setup>
import { ref, computed, onMounted } from 'vue'
import io from "socket.io-client"

const socket = io("http://localhost:3000");

const player = ref('X')
const board = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
])

socket.on("board", data => board.value = data);
socket.on("player", data => player.value = data);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const winner = computed(() => calculateWinner(board.value.flat()))

const makeMove = (x, y) => {
  if (winner.value) return 
  if (board.value[x][y] != '') return
  // board.value[x][[y]] = player.value
  socket.emit("makeMove", x, y, player.value);
}


const resetGame = () => {
  socket.emit("resetGame");
}

onMounted(() => {
  console.log("This runs when the component is mounted");

    // socket.emit("getBoard");
});

</script>

<template>
  <main class="pt-8 text-center dark:bg-gray-800 min-h-screen dark:text-white">
    <h1 class="mb-8 text-3xl font-bold uppercase" >Hellow, labazers!</h1>
    <h3 class="text-xl mb-4">Player {{ player }}</h3>
    <div class="flex flex-col items-center mb-8">
      <div
        v-for="(row, x) in board"
        :key="x"
        class="flex">

        <div
          v-for="(cell, y) in row"
          :key="y"
          @click="makeMove(x, y)"
          class=""
          :class="`border border-white w-20 h-20 hover:bg-gray-700 
            flex justify-center items-center text-4xl cursor-pointer font-[Material_Icons_Outlined] `">
            {{ cell === 'X' ? 'close' : cell === 'O' ? 'circle' : ''}}
        </div>

      </div>
    </div>

    <h2 v-if="winner" class="text-4xl font-bold mb-8" > Player {{ winner }} wins</h2>
    <button class="btn bg-red-600 focus:ring-0 focus:outline-none font-medium rounded-lg px-5 py-2.5 mb-2 text-sm hover:bg-red-700" @click="resetGame()">
      Reset game
    </button>
  
  </main>
</template>

<style scoped>
.p {
  display: flex;
  font-family: "";
}
</style>

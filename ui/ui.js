const App = Vue.createApp({
  data() {
    return {
      visible: false,

      search: '',
      players: [],
      currentPlayer: false,
    };
  },
  computed: {
    filteredPlayers() {
      if (this.search === "") return this.players;

      return this.players.filter((player) => {
        return (
          player.name.toLowerCase().includes(this.search.toLowerCase()) ||
          player.serverId.toLowerCase().includes(this.search.toLowerCase()) ||
          player.jobText.toLowerCase().includes(this.search.toLowerCase()) ||
          player.group.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    close() {
      fetch(`https://${GetParentResourceName()}/close`);
    },
    update() {
      fetch(`https://${GetParentResourceName()}/update`);
    },
    off() {
      fetch(`https://${GetParentResourceName()}/spectateoff`);
    },
    spectate(player) {
      fetch(`https://${GetParentResourceName()}/spectate`, {
        method: 'POST',
        body: JSON.stringify({
          player,
        }),
      });
    },
    async kick(player) {
      const { value: reason } = await Swal.fire({
        title: 'Enter kick reason',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
        },
      });

      if (!reason) return;

      fetch(`https://${GetParentResourceName()}/kick`, {
        method: 'POST',
        body: JSON.stringify({
          player,
          reason,
        }),
      });
    },
  },
  mounted() {
    window.addEventListener('message', ({ data }) => {
      if (data.visible !== undefined) this.visible = data.visible;
      if (data.players !== undefined) this.players = data.players;
      if (data.playerInfo !== undefined) this.currentPlayer = data.playerInfo;
    });
  },
}).mount('#app');

const playerInfoElement = document.querySelector('#playerinfo #data');
window.addEventListener('message', ({ data }) => {
  if (data.playerInfo !== undefined) {
    if (!data.playerInfo) {
      playerInfoElement.style.display = 'none';
      return;
    }
    playerInfoElement.style.display = 'block';
    playerInfoElement.innerHTML = data.playerInfo.join('<br>');
  }
});

function logKey(e) {
  if (e.key == "Escape") {
    fetch(`https://${GetParentResourceName()}/close`);
  }
}

document.addEventListener("keydown", logKey);


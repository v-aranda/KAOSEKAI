<script setup lang="ts">
import { useCharacterStore } from '../../../stores/characterStore';

const store = useCharacterStore();
</script>

<template>
  <div class="panel-box">
    <h3 class="glitch-title">ATAQUES</h3>

    <div class="scroll-area">
      <div class="list-container">
        <div v-for="(attack, index) in store.char.attacks" :key="index" class="attack-card">
          <div class="card-header">
            <input v-model="attack.name" placeholder="NOME DO ATAQUE" class="input-name" />
            <button class="remove-btn" @click="store.removeAttack(index)">×</button>
          </div>
          <div class="card-stats">
            <div class="stat-field">
              <label>DANO</label><input v-model="attack.damage" placeholder="1d6+2" />
            </div>
            <div class="stat-field">
              <label>RASPÃO</label><input v-model="attack.graze" placeholder="0" />
            </div>
            <div class="stat-field">
              <label>CRÍTICO</label>
              <input v-model="attack.critical" placeholder="20 / x2"
                @blur="(!attack.critical) ? attack.critical = '20 / x2' : null" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="add-btn" @click="store.addAttack()">+ NOVO ATAQUE</button>
  </div>
</template>

<style scoped lang="scss">
.panel-box {
  border: 3px solid black;
  border-radius: 4px;
  padding: 20px 15px 15px 15px;
  background: #ffffff;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
  position: relative;
  margin-top: 15px;
}

.glitch-title {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Share Tech Mono', monospace;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 1.2rem;
  background: white;
  padding: 2px 5px;
  white-space: nowrap;
  z-index: 10;
}

.scroll-area {
  max-height: 210px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attack-card {
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-left: 4px solid #c2002f;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 5px;

  .input-name {
    width: 100%;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    text-transform: uppercase;
    border: none;
    outline: none;
    color: black;

    &::placeholder {
      color: #ccc;
    }
  }

  .remove-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
      color: red;
    }
  }
}

.card-stats {
  display: flex;
  gap: 10px;
}

.stat-field {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  label {
    font-size: 0.6rem;
    font-weight: bold;
    color: #555;
    font-family: 'Share Tech Mono', monospace;
  }

  input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #eee;
    font-family: 'Cinzel', serif;
    font-weight: bold;
    font-size: 1rem;
    color: #000080;
    outline: none;

    &:focus {
      border-bottom: 1px solid black;
    }
  }
}

.add-btn {
  width: 100%;
  padding: 8px;
  background: black;
  color: white;
  border: none;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background: #333;
  }
}
</style>
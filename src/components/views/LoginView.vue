<template>
    <p>Login</p>
    <div class="flex">
        {{ store.currentUser }}
        <input
            v-model="email"
            type="text"
            placeholder="Ingrese el email"
        >
        <input
            v-model="password"
            type="password"
            placeholder="Ingrese la contraseña"
        >
        <button @click="() => handleLogin({email, password})">
            Login
        </button>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/UserStore';
const store = useUserStore()
const email = ref("")
const password = ref("")

const handleLogin = async (user) => {
    const users = await (await axios.get('https://www.mockachino.com/1b143c6b-6b18-43/users')).data.users

    //ESTO NO FUNCIONA
    if(await users.find((u) => user.email == u.email && user.password == u.password)){
        store.login(user)

    } else {
        console.log('NO se encontro al usuario!');
    }
}
</script>
<style>
.flex {
    display: flex;
    flex-direction: column;
}
</style>

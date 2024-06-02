<template>
    <p>Login</p>
    <div class="flex">
        {{ userStore.currentUser }}
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
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const email = ref("")
const password = ref("")

const handleLogin = async (user) => {
    try {
        // traigo todos los usuarios
        const users = await (await axios.get('https://www.mockachino.com/1b143c6b-6b18-43/users')).data.users
        if(!users){
            throw 'Error en fetching de usuarios';
        }

        // TODO cambiar condicion del find
        const userFound = await users.find((u) => user.email == u.email && user.password == u.password)
        if(!userFound){
            throw 'El usuario o la contraseña son incorrectos';
        }

        // guardo el usuario en el estado 
        userStore.login(userFound)
        
        // redireccion por rol
        if(userFound.rol == 'admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }
    } catch (err) {
        console.log(err);
    }
}

</script>
<style>
.flex {
    display: flex;
    flex-direction: column;
}
</style>

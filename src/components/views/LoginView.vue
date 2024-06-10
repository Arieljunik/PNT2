<template>
    <div class="container">
        <h2>Login</h2>
        <form action="#">
            <div class="data">
                <label for="email">Mail</label>
                <input
                    id="email"
                    v-model="email"
                    type="text"
                    placeholder="Ingrese el email"
                >
            </div>
            <div class="data">
                <label for="password">Contraseña</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Ingrese la contraseña"
                >
            </div>
            <button type="button" @click="() => handleLogin({email, password})">
                Login
            </button>
        </form>
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
    } catch (err) {
        console.log(err);
    }
}

</script>
<style>

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
}

.container form .data {
    width: 100%;
    text-align: left;
    margin-top: 20px;
    margin-bottom: 20px;
}



form .data label {
    font-size: 16px;
}

form .data input {
    height: 100%;
    width: 100%;
    padding: 6px;
    padding-left: 10px;
    font-size: 16px;
    box-sizing: border-box;
}

form button {
    height: 100%;
    width: 100%;
    background-color: rgb(224, 224, 224);
}

</style>

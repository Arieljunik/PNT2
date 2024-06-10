import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";


export const useUserStore = defineStore('userStore', () => {
    const _router = useRouter()
    //State
    const _currentUser = ref({})

    //Getter
    const currentUser = computed(() => _currentUser.value)

    // persistencia del usuario en localStorage
    if(localStorage.getItem("currentUser")) {
        _currentUser.value = JSON.parse(localStorage.getItem("currentUser"))
    }
    watch(
        _currentUser,
        (userVal) => {
            localStorage.setItem("currentUser", JSON.stringify(userVal))
        },
        { deep: true }
    )

    //Action
    function login (user) {
        _currentUser.value = user

        // redireccion por rol
        if(user.rol == 'admin') {
            _router.push('/admin')
        } else {
            _router.push('/')
        }
    }

    function logout () {
        _currentUser.value = {}
        _router.push('/login')
    }

    const isAdmin = computed(() => _currentUser.value.rol == 'admin')
    
    const isUserAutenticated = computed(() => _currentUser.value.rol != null)

    return {currentUser, isUserAutenticated, isAdmin, login, logout}
})
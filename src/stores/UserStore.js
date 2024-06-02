import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";


export const useUserStore = defineStore('userStore', () => {
    const _router = useRouter()
    //State
    const _currentUser = ref({})

    //Getter
    const currentUser = computed(() => _currentUser.value)

    //Action
    function login (user) {
        _currentUser.value = user

        // redireccion por rol
        if(userFound.rol == 'admin') {
            _router.push('/admin')
        } else {
            _router.push('/')
        }
    }

    function logout () {
        _currentUser.value = {}
        _router.push('/login')
    }
    
    const isUserAutenticated = computed(() => _currentUser.value != null)

    return {currentUser, isUserAutenticated, login, logout}
}) 
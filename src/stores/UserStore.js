import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore('userStore', () => {
    //State
    const _currentUser = ref(0)

    //Getter
    const currentUser = computed(() => _currentUser.value)

    //Action
    //ESTO NO FUNCIONA (login)
    const login = (user) => {
        _currentUser = user
    }
    
    const isUserAutenticated = computed(() => _currentUser.value != null)

    return {currentUser, isUserAutenticated, login}
}) 
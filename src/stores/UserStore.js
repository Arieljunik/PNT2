import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore('userStore', () => {
    //State
    const _currentUser = ref({})

    //Getter
    const currentUser = computed(() => _currentUser.value)

    //Action
    function login (user) {
        _currentUser.value = user
    }
    
    const isUserAutenticated = computed(() => _currentUser.value != null)

    return {currentUser, isUserAutenticated, login}
}) 
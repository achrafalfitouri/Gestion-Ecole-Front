import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:8001';

let refresh = false;

// Fonction pour mettre à jour les cookies
const updateCookies = (newToken, newRefreshToken) => {
  document.cookie = `token=${newToken}; path=/`;
  document.cookie = `refresh_token=${newRefreshToken}; path=/`;
};

// Fonction pour rafraîchir le token
const refreshTokens = async () => {
  const refresh_token = document.cookie
    .split('; ')
    .find(row => row.startsWith('refresh_token='))
    .split('=')[1];

  try {

    const response = await axios.post(
      '/api/token/refresh',
      { refresh_token },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const newToken = response.data.token;
      const newRefreshToken = response.data.refresh_token;



      // Mettre à jour le token et le refresh token dans les cookies
      updateCookies(newToken, newRefreshToken);

      // Mettre à jour l'en-tête Authorization avec le nouveau token
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
  } catch (error) {
    console.log(error);
    // Gérer l'erreur lors du rafraîchissement du token
  }
};

// Démarrer l'intervalle de rafraîchissement du token
let refreshInterval = setInterval(refreshTokens, 10000); // 10 secondes

axios.interceptors.response.use(
  resp => resp,
  async error => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;

      // Effacer l'intervalle de rafraîchissement du token
      clearInterval(refreshInterval);

      // Effectuer le rafraîchissement du token
      await refreshTokens();

      // Reprendre l'intervalle de rafraîchissement du token
      refreshInterval = setInterval(refreshTokens, 10000); // 10 secondes

      // Réessayer la requête échouée avec le nouveau token
      error.config.headers['Authorization'] = `Bearer ${document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        .split('=')[1]}`;

      return axios.request(error.config);
    }

    refresh = false;
    return Promise.reject(error);
  }
);

export default axios;

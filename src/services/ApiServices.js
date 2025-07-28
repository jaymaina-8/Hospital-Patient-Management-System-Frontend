import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000, // 10-second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

export function getPatient(){
    return api.get('/patients/')
        .then(res => res.data)
        .catch(error => {
            console.error("API Error:", error);
            // Enhance error handling for network issues
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your connection and try again.');
            } else if (!error.response) {
                const connectionError = new Error('No response from server. Please check your connection.');
                connectionError.isConnectionError = true;
                throw connectionError;
            } else if (error.response && error.response.status === 404) {
                throw new Error('The requested resource was not found. Please check the URL and try again.');
            }
            throw error;
        })
}

export function deletePatient(id){
    return api.delete(`/patients/${id}/`)
        .then(res => res.data)
        .catch(error => {
            console.error("API Error:", error);
            // Enhance error handling for network issues
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your connection and try again.');
            } else if (!error.response) {
                const connectionError = new Error('No response from server. Please check your connection.');
                connectionError.isConnectionError = true;
                throw connectionError;
            } else if (error.response && error.response.status === 404) {
                throw new Error(`Patient with ID ${id} not found. It may have been deleted already.`);
            }
            throw error;
        })
}

export function addPatient(patientData){
    return api.post('/patients/', patientData)
        .then(res => res.data)
        .catch(error => {
            console.error("API Error:", error);
            // Enhance error handling for network issues
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your connection and try again.');
            } else if (!error.response) {
                const connectionError = new Error('No response from server. Please check your connection.');
                connectionError.isConnectionError = true;
                throw connectionError;
            } else if (error.response && error.response.status === 404) {
                throw new Error('The patients endpoint was not found. Please check the API configuration.');
            }
            throw error;
        })
}

export function updatePatient(id, patientData){
    return api.put(`/patients/${id}/`, patientData)
        .then(res => res.data)
        .catch(error => {
            console.error("API Error:", error);
            // Enhance error handling for network issues
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your connection and try again.');
            } else if (!error.response) {
                const connectionError = new Error('No response from server. Please check your connection.');
                connectionError.isConnectionError = true;
                throw connectionError;
            } else if (error.response && error.response.status === 404) {
                throw new Error(`Patient with ID ${id} not found. It may have been deleted or the ID is incorrect.`);
            }
            throw error;
        })
}

import { baseUrl } from './config.json';


const TIMEOUT = 1000000;

const handleUnauthorized = () => {
  localStorage.clear()
  window.location.reload();
};
const handleRequest = async (dispatch, url, method, types, body = null) => {
  const [START, SUCCESS, FAILURE] = types;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    dispatch({ type: START, loading: true, networkError: false });
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      signal: controller.signal,
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${url}`, options);
    const res = await response.json();


    if (response.status === 200 || response.status === 201) {
      dispatch({ type: SUCCESS, loading: false, payload: res });
    }
    else if (response.status === 403) {
      if ("roleUpdated" in res) {
        handleUnauthorized();
      }
      else {
        dispatch({ type: FAILURE, loading: false, networkError: true });
      }
    } else if (response.status === 401) {
      handleUnauthorized();
    } else if (response.status === 404) {
      dispatch({ type: FAILURE, loading: false, networkError: true });
    } else {
      dispatch({ type: FAILURE, loading: false, networkError: true });
    }
  } catch (error) {
    dispatch({ type: FAILURE, loading: false, networkError: true });
  } finally {
    clearTimeout(timeout);
  }
};


export { handleRequest }



// new UI


// import { baseUrl } from './config.json';

// const TIMEOUT = 10000;

// const handleUnauthorized = () => {
//   localStorage.clear();
//   window.location.reload();
// };

// const handleRequest = async (
//   dispatch,
//   url,
//   method = 'GET',
//   types = [],
//   body = null
// ) => {
//   if (!types || types.length !== 3) {
//     throw new Error('You must provide an array of three Redux action types [START, SUCCESS, FAILURE]');
//   }

//   const [START, SUCCESS, FAILURE] = types;

//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), TIMEOUT);

//   try {
//     dispatch({ type: START, loading: true, networkError: false });

//     const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

//     const options = {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//       },
//       signal: controller.signal,
//     };

//     if (body !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
//       options.body = JSON.stringify(body);
//     }

//     const response = await fetch(`${baseUrl}${url}`, options);

//     // Try to parse JSON safely
//     let data;
//     try {
//       data = await response.json();
//     } catch {
//       data = null;
//     }

//     // Handle response based on status code
//     switch (response.status) {
//       case 200:
//       case 201:
//         dispatch({ type: SUCCESS, loading: false, payload: data });
//         break;

//       case 400:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Bad Request', networkError: false });
//         break;

//       case 401:
//         handleUnauthorized();
//         break;

//       case 403:
//         if (data?.roleUpdated) {
//           handleUnauthorized();
//         } else {
//           dispatch({ type: FAILURE, loading: false, error: data || 'Forbidden', networkError: false });
//         }
//         break;

//       case 404:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Not Found', networkError: false });
//         break;

//       case 409:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Conflict', networkError: false });
//         break;

//       case 422:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Unprocessable Entity', networkError: false });
//         break;

//       case 500:
//       case 502:
//       case 503:
//       case 504:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Server Error', networkError: true });
//         break;

//       default:
//         dispatch({ type: FAILURE, loading: false, error: data || 'Unknown Error', networkError: true });
//         break;
//     }
//   } catch (error) {
//     if (error.name === 'AbortError') {
//       dispatch({ type: FAILURE, loading: false, error: 'Request Timeout', networkError: true });
//     } else {
//       dispatch({ type: FAILURE, loading: false, error: error.message || 'Network Error', networkError: true });
//     }
//   } finally {
//     clearTimeout(timeout);
//   }
// };

// export { handleRequest };

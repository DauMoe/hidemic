import axios from "axios";
import { BASE_URL } from "./ApiUrl";
import { LoadToken } from "./SqlLiteHelper";

const _METHOD = ["get", "post", "put", "delete", "GET", "POST", "PUT", "DELETE"] as const;
export type AXIOS_METHOD = typeof _METHOD[number];

let TOKEN: any;

(function() {
	if (!TOKEN) {
		LoadToken()
			.then(r => {
				console.log(r);
				TOKEN = r;
			})
			.catch(e => console.error("Load token fail"));
	}
})();

export const AxiosHelper = function(endpoint: string, method: AXIOS_METHOD, data?: any, config?: any) {
	const instance = axios.create({
		baseURL: BASE_URL
	});
	// instance.interceptors.request.use(request => {
	// 	console.log("R:", request.data);
	// 	return request;
	// });
	// instance.interceptors.response.use(response => {
	//    const { code, data } = response.data;
	//    if (code === 401) {

	//    }
	//    return response;
	// });

	if (TOKEN && TOKEN !== "") instance.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
	switch(method.toUpperCase()) {
		case "POST":
			return instance.post(endpoint,  data, config);
		case "PUT":
			return instance.put(endpoint, data, config);
		case "DELETE":
			return instance.delete(endpoint, config);
		case "GET":
		default:
			return instance.get(endpoint, data);
	}
}
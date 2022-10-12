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

export const AxiosHelper = function(endpoint: string, method: AXIOS_METHOD, config: any | undefined) {
	const instance = axios.create({
			baseURL: BASE_URL
	});
	// instance.interceptors.response.use(response => {
	//    const { code, data } = response.data;
	//    if (code === 401) {

	//    }
	//    return response;
	// });

	if (TOKEN && TOKEN !== "") instance.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
	switch(method.toUpperCase()) {
		case "GET":
			return instance.get(endpoint, config);
		case "POST":
			return instance.post(endpoint, config);
		case "PUT":
			return instance.put(endpoint, config);
		case "DELETE":
			return instance.delete(endpoint, config);
		default:
			return new Error(`Method '${method}' is not supported!`);
	}
}
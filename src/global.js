import { toast } from "react-toastify";
import config from "./config";
import { parseISO, format, formatDistanceToNow } from 'date-fns'


export const baseUrl = "/api/v1"; // URL tương đối


export function getUrl(subUrl) {
    return config.baseUrl + subUrl;
}

export async function fetchData(subUrl, method, body) {
    const url = getUrl(subUrl);
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) throw new Error("Access token is missing")

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    }
    if (body) options.body = JSON.stringify(body)
    try {
        const responseAPI = await fetch(url, options)
        const response = await responseAPI.json()
        if (!responseAPI.ok) {
            const error = { code: responseAPI.status, message: response.message || 'An error occurred' };
            throw error;
        }
        return {
            data: response.data,
            message: response.message
        }
    }
    catch (error) {
        throw error
    }
}


export async function fetchDataWithoutAccessToken(subUrl, method, body) {
    const url = getUrl(subUrl);
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    }
    if (body) options.body = JSON.stringify(body);
    const responseAPI = await fetch(url, options);
    const response = await responseAPI.json();
    if (!responseAPI.ok) {
        const error = { code: responseAPI.status, message: response.message || 'An error occurred' };
        throw error;
    }
    return {
        data: response.data,
        message: response.message
    }


}






export function convertValueFromSelect(str) {
    if (str === 'null') return null
    if (str == 'true') return true
    if (str === 'false') return false
    else return +str // chuyển về số.
}


export function handleError(code) {
    switch (code) {
        case 400:
            console.error('Bad Request: Yêu cầu không hợp lệ!')
            break;
        case 401:
            console.error('Unauthorized: Người dùng chưa đăng nhập!')

            break;
        case 403:
            console.error('Forbidden: Người dùng không có quyền truy cập!')
            break;
        case 404:
            console.error('Not Found: Không tìm thấy tài nguyên!')
            break;
        default:
            console.error('Lỗi khác:')
            break;
    }
}

export const showToastMessage = (message) => {
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
    });
};



export const showToastMessageV2 = (message, callback) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    onClose: callback, // Gọi callback khi thông báo đóng
    autoClose: 3000,   // Thời gian tự động đóng (tùy chỉnh nếu cần)
  });
};


export const showToastError = (message) => {
    toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
    });
};


export const handleActionResult = (isSuccess, actionType, t) => {
    if (isSuccess) {
        showToastMessage(t(`NOTIFICATION.SUCCESS.${actionType}`));
    } else {
        showToastError(t(`NOTIFICATION.ERROR.${actionType}`));
    }
};

export function customFormatDistanceToNow(isoDateString) {
    try {
        const date = parseISO(isoDateString)
        const timeAgo = formatDistanceToNow(date, { addSuffix: true })
        return timeAgo;
    }
    catch (error) {
        return null;
    }

}

export function customFormatDD_MM_YYYY_HH_mm(isoDateString) {
    try {
        const date = parseISO(isoDateString)
        return format(date, ' HH:mm dd/MM/yyyy');
    }

    catch (error) {
        return null;
    }
}

export function customFormatYYY_MM_DD(isoDateString) { 
    try { 
        return format(parseISO(isoDateString), "yyyy-MM-dd"); // Thêm định dạng ở đây
    } catch (error) { 
        return null; 
    }
}
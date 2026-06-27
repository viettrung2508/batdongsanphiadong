import { handleMediaUpload } from "./media.service.js";
export async function uploadMediaHandler(request, response) {
    const result = await handleMediaUpload(request);
    response.status(201).json(result);
}

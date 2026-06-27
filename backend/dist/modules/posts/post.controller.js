import { ZodError } from "zod";
import { createPost, deletePost, getPostBySlug, getPostList, updatePost } from "./post.service.js";
import { listPostsQuerySchema, postBodySchema } from "./post.schema.js";
function handlePostError(error, response) {
    if (error instanceof ZodError) {
        return response.status(400).json({
            message: "Dữ liệu không hợp lệ",
            issues: error.flatten()
        });
    }
    if (error instanceof Error && error.message === "AREA_NOT_FOUND") {
        return response.status(400).json({
            message: "Khu vực không tồn tại"
        });
    }
    throw error;
}
function getSlugParam(request) {
    return Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
}
export async function listPosts(request, response) {
    const query = listPostsQuerySchema.parse(request.query);
    const data = await getPostList(query);
    response.json({
        items: data
    });
}
export async function getPostDetail(request, response) {
    const item = await getPostBySlug(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy bài viết"
        });
    }
    response.json(item);
}
export async function createPostHandler(request, response) {
    try {
        const input = postBodySchema.parse(request.body);
        const item = await createPost(input);
        response.status(201).json(item);
    }
    catch (error) {
        handlePostError(error, response);
    }
}
export async function updatePostHandler(request, response) {
    try {
        const input = postBodySchema.parse(request.body);
        const item = await updatePost(getSlugParam(request), input);
        if (!item) {
            return response.status(404).json({
                message: "Không tìm thấy bài viết"
            });
        }
        response.json(item);
    }
    catch (error) {
        handlePostError(error, response);
    }
}
export async function deletePostHandler(request, response) {
    const deleted = await deletePost(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy bài viết"
        });
    }
    response.status(204).send();
}

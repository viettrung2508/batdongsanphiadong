"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPosts = listPosts;
exports.getPostDetail = getPostDetail;
exports.createPostHandler = createPostHandler;
exports.updatePostHandler = updatePostHandler;
exports.deletePostHandler = deletePostHandler;
const zod_1 = require("zod");
const post_service_js_1 = require("./post.service.js");
const post_schema_js_1 = require("./post.schema.js");
function handlePostError(error, response) {
    if (error instanceof zod_1.ZodError) {
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
async function listPosts(request, response) {
    const query = post_schema_js_1.listPostsQuerySchema.parse(request.query);
    const data = await (0, post_service_js_1.getPostList)(query);
    response.json({
        items: data
    });
}
async function getPostDetail(request, response) {
    const item = await (0, post_service_js_1.getPostBySlug)(getSlugParam(request));
    if (!item) {
        return response.status(404).json({
            message: "Không tìm thấy bài viết"
        });
    }
    response.json(item);
}
async function createPostHandler(request, response) {
    try {
        const input = post_schema_js_1.postBodySchema.parse(request.body);
        const item = await (0, post_service_js_1.createPost)(input);
        response.status(201).json(item);
    }
    catch (error) {
        handlePostError(error, response);
    }
}
async function updatePostHandler(request, response) {
    try {
        const input = post_schema_js_1.postBodySchema.parse(request.body);
        const item = await (0, post_service_js_1.updatePost)(getSlugParam(request), input);
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
async function deletePostHandler(request, response) {
    const deleted = await (0, post_service_js_1.deletePost)(getSlugParam(request));
    if (!deleted) {
        return response.status(404).json({
            message: "Không tìm thấy bài viết"
        });
    }
    response.status(204).send();
}

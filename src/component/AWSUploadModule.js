import { baseUrl } from '../../store/config.json';

// const AWSUploadModule = async ({ messageApi, fileArray, actualFile, moduleName, setCreateLoading }) => {
//     const getSafeUUID = (prefix = "", index = 0) => {
//         try {
//             if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
//                 return `${prefix}${crypto.randomUUID()}`;
//             }
//         } catch (e) {
//         }
//         return `${prefix}${Date.now()}_${index}_${Math.random()
//             .toString(36)
//             .slice(2, 8)}`;
//     };

//     const getExtension = contentType => {
//         if (typeof contentType !== "string") return "";
//         const parts = contentType.split("/");
//         if (parts.length < 2) return "";
//         return `.${parts[1].split("+")[0]}`;
//     };
//     const updatedData = fileArray.map((item, index) => {
//         const { key, ...rest } = item;
//         const needsPrefix = moduleName === "asset" && key === "inspection";
//         const uuidPrefix = needsPrefix ? `ws${key}_` : "";
//         const safeUUID = getSafeUUID(uuidPrefix, index);
//         const extension = getExtension(item?.contentType);
//         return {
//             ...rest,
//             fileName: `worksafe_file_${safeUUID}${extension}`,
//         };
//     });


//     const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//     let imageKeys = [];
//     try {
//         if (updatedData.length > 0) {
//             const controller = new AbortController();
//             const timeout = setTimeout(() => {
//                 controller.abort();
//             }, 1000000);
//             const options = {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     files: updatedData,
//                     moduleName: moduleName
//                 }),
//                 signal: controller.signal,
//             };
//             const response = await fetch(`${baseUrl}/assets/signed-urls`, options);
//             if (response.status == 401) {
//                 localStorage.clear()
//                 window.location.reload();
//             }
//             if (response.status == 200 || response.status == 201) {
//                 clearTimeout(timeout);
//                 const { data } = await response.json();
//                 for (let i = 0; i < data.length; i++) {
//                     const uploadFile = updatedData[i];
//                     const file = actualFile[i];
//                     const updatedFile = new File(
//                         [file],
//                         uploadFile.fileName,
//                         { type: file.type ? file.type : file?.originFileObj?.type }
//                     );
//                     const presigned = data[i];
//                     await fetch(presigned?.uploadUrl, {
//                         method: "PUT",
//                         headers: {
//                             "Content-Type": updatedFile.type,
//                         },
//                         body: updatedFile,
//                     });
//                     imageKeys.push({
//                         key: presigned?.key,
//                         originalName: updatedFile?.name,
//                         size: updatedFile?.size,
//                         mimeType: updatedFile?.type
//                     });
//                 }
//                 console.log(imageKeys,'asdasd9as9d9as9ds9a')
//                 return imageKeys
//             }
//             if (response.status == 500) {
//                 clearTimeout(timeout);
//                 messageApi.open({
//                     type: "error",
//                     content: "Something went wrong",
//                 });
//                 setCreateLoading(false)
//                 return false
//             }
//             if (response.status == 507) {
//                 clearTimeout(timeout);
//                 messageApi.open({
//                     type: "error",
//                     content: "Storage limit exceeded",
//                 });
//                 setCreateLoading(false)
//                 return false
//             }
//             if (response.status == 400) {
//                 clearTimeout(timeout);
//                 messageApi.open({
//                     type: "error",
//                     content: "Something went wrong",
//                 });
//                 setCreateLoading(false)
//                 return false
//             }
//         }
//     } catch (err) {
//         console.error("Error submitting:", err);
//         setCreateLoading(false)
//         return false
//     }
//     return false
// }





const AWSUploadModule = async ({
    messageApi,
    fileArray,
    actualFile,
    moduleName,
    setCreateLoading
}) => {

    const getSafeUUID = (prefix = "", index = 0) => {
        try {
            if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                return `${prefix}${crypto.randomUUID()}`;
            }
        } catch (e) { }

        return `${prefix}${Date.now()}_${index}_${Math.random()
            .toString(36)
            .slice(2, 8)}`;
    };

    const getExtension = (contentType) => {
        if (typeof contentType !== "string") return "";
        const parts = contentType.split("/");
        if (parts.length < 2) return "";
        return `.${parts[1].split("+")[0]}`;
    };

    // Prepare file metadata
    const updatedData = fileArray.map((item, index) => {

        const { key, ...rest } = item;

        const needsPrefix = moduleName === "asset" && key === "inspection";
        const uuidPrefix = needsPrefix ? `ws${key}_` : "";

        const safeUUID = getSafeUUID(uuidPrefix, index);

        const file = actualFile[index];
        const type = file?.type || file?.originFileObj?.type;

        const extension = getExtension(type);

        return {
            ...rest,
            fileName: `worksafe_file_${safeUUID}${extension}`,
        };
    });

    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    let imageKeys = [];

    try {

        if (updatedData.length === 0) return [];

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 1000000);

        const response = await fetch(`${baseUrl}/assets/signed-urls`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                files: updatedData,
                moduleName: moduleName,
            }),
            signal: controller.signal,
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.reload();
            return false;
        }

        if (response.status === 500 || response.status === 400) {
            clearTimeout(timeout);

            messageApi.open({
                type: "error",
                content: "Something went wrong",
            });

            setCreateLoading(false);
            return false;
        }

        if (response.status === 507) {
            clearTimeout(timeout);

            messageApi.open({
                type: "error",
                content: "Storage limit exceeded",
            });

            setCreateLoading(false);
            return false;
        }

        if (response.status === 200 || response.status === 201) {

            clearTimeout(timeout);

            const { data } = await response.json();

            for (let i = 0; i < data.length; i++) {

                const uploadFile = updatedData[i];
                const file = actualFile[i];

                const updatedFile = new File(
                    [file],
                    uploadFile.fileName,
                    {
                        type: file?.type || file?.originFileObj?.type
                    }
                );

                const presigned = data[i];

                await fetch(presigned?.uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": updatedFile.type,
                    },
                    body: updatedFile,
                });

                imageKeys.push({
                    key: presigned?.key,
                    originalName: updatedFile?.name,
                    size: updatedFile?.size,
                    mimeType: updatedFile?.type,
                });
            }
            return imageKeys;
        }

    } catch (err) {

        console.error("Upload Error:", err);

        messageApi.open({
            type: "error",
            content: "File upload failed",
        });

        setCreateLoading(false);

        return false;
    }

    return false;
};



const AWSUploadModuleFilter = async ({ messageApi, fileArray, actualFile, moduleName, setCreateLoading }) => {
    const updatedData = fileArray.map((item, index) => {
        const safeUUID =
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`;

        const extension =
            typeof item?.contentType === "string" && item.contentType.includes("/")
                ? `.${item.contentType.split("/")[1]}`
                : "";

        return {
            ...item,
            fileName: `worksafe_file_${safeUUID}${extension}`,
        };
    });
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    let imageKeys = [];
    try {
        if (updatedData.length > 0) {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 1000000);
            const options = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    files: updatedData,
                    moduleName: moduleName
                }),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}/assets/signed-urls`, options);
            if (response.status == 401) {
                localStorage.clear()
                window.location.reload();
            }
            if (response.status == 200 || response.status == 201) {
                clearTimeout(timeout);
                const { data } = await response.json();
                for (let i = 0; i < data.length; i++) {
                    const uploadFile = updatedData[i];
                    const { file, source } = actualFile[i];
                    const updatedFile = new File(
                        [file],
                        uploadFile.fileName,
                        { type: file.type }
                    );
                    const presigned = data[i];
                    await fetch(presigned?.uploadUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": updatedFile.type,
                        },
                        body: updatedFile,
                    });
                    imageKeys.push({
                        key: presigned?.key,
                        originalName: updatedFile?.name,
                        size: updatedFile?.size,
                        mimeType: updatedFile?.type,
                        source
                    });
                }
                return imageKeys
            }
            if (response.status == 500) {
                clearTimeout(timeout);
                messageApi.open({
                    type: "error",
                    content: "Something went wrong",
                });
                setCreateLoading(false)
                return false
            }
            if (response.status == 507) {
                clearTimeout(timeout);
                messageApi.open({
                    type: "error",
                    content: "Storage limit exceeded",
                });
                setCreateLoading(false)
                return false
            }
            if (response.status == 400) {
                clearTimeout(timeout);
                messageApi.open({
                    type: "error",
                    content: "Something went wrong",
                });
                setCreateLoading(false)
                return false
            }
        }
    } catch (err) {
        console.error("Error submitting:", err);
        setCreateLoading(false)
        return false
    }
}

export { AWSUploadModule, AWSUploadModuleFilter };








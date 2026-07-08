const ORDERS_API_URL = "http://localhost:3000/api/orders";
const RETURNS_API_URL = "http://localhost:3000/api/returns";
const CUTS_API_URL = "http://localhost:3000/api/rental-cuts";

const getHeaders = () => ({

    Authorization:
        `Bearer ${localStorage.getItem("token")}`,

    "Content-Type":
        "application/json"

});

const getErrorMessage = async (
    response,
    fallback
) => {

    const error =
        await response.json().catch(() => ({}));

    return error.error || fallback;

};




//--------------------------
// Workspace
//--------------------------
export const getWorkspace = async ( orderId) => {

    const response =
        await fetch(

            `${ORDERS_API_URL}/${orderId}/workspace`,

            {
                headers:getHeaders()
            }

        );

    if(!response.ok){

        throw new Error(
            await getErrorMessage(
                response,
                "No se pudo cargar el workspace"
            )
        );

    }

    return await response.json();

};



//------------------------------
// Returns
//-------------------------------

export const createReturn = async ( data ) => {

    const response =
        await fetch(
            RETURNS_API_URL,
            {
                method:"POST",
                headers:getHeaders(),
                body:JSON.stringify(data)
            }

        );

    if(!response.ok){

        throw new Error(
            await getErrorMessage(
                response,
                "Error creando devolucion"
            )
        );
    }

    return await response.json();

};



export const updateReturn = async (returnId,data) => {

    const response =
        await fetch(

            `${RETURNS_API_URL}/${returnId}`,
            {
                method:"PUT",
                headers:getHeaders(),
                body:JSON.stringify(data)
            }
        );

    if(!response.ok){

        throw new Error(
            await getErrorMessage(
                response,
                "Error actualizando devolucion"
            )
        );

    }

    return await response.json();

};



export const deleteReturn = async (returnId) => {

    const response =
        await fetch(

            `${RETURNS_API_URL}/${returnId}`,
            {
                method:"DELETE",
                headers:getHeaders()
            }
        );

    if(!response.ok){

        throw new Error(
            await getErrorMessage(
                response,
                "Error eliminando devolucion"
            )
        );

    }

    return true;

};






//------------------------
//  Cuts
//-------------------------

export const createCut = async (data) => {

    const response =
        await fetch(
            CUTS_API_URL,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data)
            }
        );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(
                response,
                "Error creando corte"
            )
        );
    }
    
    return await response.json();
};




export const getCutsByOrder = async (orderId) => {

    const response = await fetch(

        `${CUTS_API_URL}/order/${orderId}`,
        {
            headers: getHeaders()
        }
    );

    if (!response.ok) {
        throw new Error(
            "No se pudieron cargar los cortes"
        );
    }

    return await response.json();

};
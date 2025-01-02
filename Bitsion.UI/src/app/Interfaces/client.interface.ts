export interface Client {
    id?: string,
    longName: string,
    age: number,
    email: string,
    gender: Gender,
    phone: string,
    state: State,
    nationality: Nationality,
    canDrive: boolean,
    isDiabetic: boolean,
    wearGlasses: boolean,
    otherDiseases: string | null
}

export interface ClientResponse {
    success: boolean,
    message: string,
    data: Client
}

export interface ClientsResponse {
    success: boolean,
    message: string,
    data: Client[]
}

export interface ClientState {
    loading: boolean,
    error: string | null,
    clients: Client[],
    client: Client | null
}

export enum Nationality {
    Argentina = "Argentina",
    Brasil = "Brasil",
    Chile = "Chile",
    Uruguay = "Uruguay",
    Paraguay = "Paraguay"
}

// por propósitos de reglas de negocio, cliente con cobertura de seguro de vida o sin
export enum State {
    Activo = "Activo",
    Inactivo = "Inactivo"
}

export enum Gender {
    Masculino = "Masculino",
    Femenino = "Femenino",
    Otro = "Otro"
}
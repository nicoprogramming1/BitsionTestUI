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

export type ClientResponse = Client;

export type Clients = Client[];

// lista de clientes con paginación
export interface ClientsResponse {
    clients: ClientResponse[];   // array de clientes
    totalCount: number;          // total
    pageNumber: number;          // página actual
    pageSize: number;            // cantidad de cloients por página
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
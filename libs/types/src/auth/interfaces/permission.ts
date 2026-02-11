export interface CreatePermission {
  name: string;
  category: string;
}

export interface Permission extends CreatePermission {
  _id: string;
}

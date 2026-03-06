import { CreateMessage } from "@newmbani/types";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../../common/routes.constants";

@Injectable({
    providedIn: 'root',
})
export class CreateContactMessageService {
    private httpClient = inject(HttpClient);

    createContactMessage(contact: CreateMessage): any {
    const endpoint = API_ENDPOINTS.CREATE_CONTACT_MESSAGE;
    return this.httpClient.post(endpoint, contact);
  }
}   
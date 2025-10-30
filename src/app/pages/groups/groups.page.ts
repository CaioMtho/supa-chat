import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  user = this.authService.getCurrentUser();
  groups = [];

  constructor(
    private authService: AuthService,
    private data: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navContoller: NavController,
    private router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.groups = await this.data.getGroups();
    console.log('groups: ', this.groups);
  }

  async createGroup() {
    const alert = await this.alertController.create({
      header: 'Comece um grupo de chat',
      message: 'Insira o nome do chat público!',
      inputs: [
        {
          type: 'text',
          name: 'title',
          placeholder: 'Meu grupo',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Criar grupo',
          handler: async (data) => {
            const loading = await this.loadingController.create();
            await loading.present();

            const newGroup = await this.data.createGroup(data.title);
            console.log('new group: ', newGroup);
            if (newGroup) {
              this.groups = await this.data.getGroups();
              await loading.dismiss();

              this.router.navigateByUrl(`/groups/${newGroup.data.id}`);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  signOut() {
    this.authService.signOut();
  }

  openLogin() {
    this.navContoller.navigateBack('/');
  }
}

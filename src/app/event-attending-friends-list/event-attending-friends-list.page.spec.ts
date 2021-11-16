import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventAttendingFriendsListPage } from './event-attending-friends-list.page';

describe('EventAttendingFriendsListPage', () => {
  let component: EventAttendingFriendsListPage;
  let fixture: ComponentFixture<EventAttendingFriendsListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAttendingFriendsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendingFriendsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const apiDelete = require('../../src/api/apiDel');
describe('Тесты отображение', () => {
  beforeEach(async () => {
    await apiDelete();
  });

  it('Главная страница, без настроек, открывается', function () {
    return this.browser
      .url('/')
      .assertExists('.settings-info', 'Главная страница похоже не открылась')
      .assertView('mainPage', 'body')
  });

  it('Можно перейти с главной, на settings', function () {
    return this.browser
      .url('/')
      .pause(500)
      .click('.button_accent')
      .pause(1000)
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('settings', 'body')
  });

  it('Можно перейти с главной, на settings, кнопкой в header', function () {
    return this.browser
      .url('/')
      .pause(500)
      .click('.button__header')
      .pause(1000)
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('settingsfromHeaderBtn', 'body')
  });

  it('Страница Settings открывается, и проходит тесты', function () {
    return this.browser
      .url('/settings')
      .assertExists('.settings__form', 'Форма с настройками появилась')
      .assertView('plain', 'body');
  });

  it('Страница Settings открывается, и можно сохранить настройки', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
      .assertView('card', '.card', {
        ignoreElements: ['.card__number-ticket_queue']
      })
  });

  it('Страница history открывается, и можно сделать Run Build', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(1500)
      .click('.button__header')
      .pause(1000)
      .click('#hash')
      .keys(['50edd056baf1d984a75b61acdef3f73050ffca49'])
      .pause(500)
      .click('.button__settings')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
      .assertView('cardOnManulAdd', '.card', {
        ignoreElements: ['.card__number-ticket_queue']
      })
  });

  it('Страница histoey открывается, и можно перейти на details', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .click('.button__settings')
      .pause(2000)
      .click('.card')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
      .assertView('card', '.card', {
        ignoreElements: ['.card__number-ticket_queue']
      })
  });

  it('Можно сделать rebuild на Details', function () {
    return this.browser
      .url('/settings')
      .click('#repoName')
      .keys(['namtyda/reference'], '\uE007')
      .pause(1000)
      .click('.button__settings')
      .pause(2000)
      .click('.card')
      .pause(2000)
      .click('.button__header')
      .pause(2000)
      .assertExists('.card', 'карточи не появились')
      .assertView('card', '.card', {
        ignoreElements: ['.card__number-ticket_queue']
      })
  });
});

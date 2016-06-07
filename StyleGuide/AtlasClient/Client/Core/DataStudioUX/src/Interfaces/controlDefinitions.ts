declare module Microsoft.DataStudio.Application.Knockout.Components
{
    interface IMenuItem
    {
        text: string;
        iconSymbol: string;
        activeMenuMatchKey: string;
        navigationUrl: string;
        action: any;
    }

    interface IMenu
    {
        menuItems: KnockoutObservable<IMenuItem[]>;
        activeMenuItem: KnockoutObservable<IMenuItem>;
        action :any;
    }
}


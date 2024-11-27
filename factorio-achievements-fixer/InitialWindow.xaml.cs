using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace factorio_achievements_fixer;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class InitialWindow : Window
{
    public InitialWindow()
    {
        // InitializeComponent();

        var listView = new ListView
        {
            Margin = new Thickness(10)
        };

        var gridView = new GridView();
        gridView.Columns.Add(new GridViewColumn
        {
            Header = "File Name",
            DisplayMemberBinding = new Binding("FileName")
        });

        listView.View = gridView;

        var grid = new Grid();
        grid.Children.Add(listView);

        Content = grid;
    }

    private void Grid_Drop(object sender, DragEventArgs e)
    {
        if (!e.Data.GetDataPresent(DataFormats.FileDrop))
            return;

        var files = (string[])e.Data.GetData(DataFormats.FileDrop) ?? Array.Empty<string>();
        if (files.Length != 1)
        {

        }
    }

    private void Grid_DragOver(object sender, DragEventArgs e)
    {
        if (e.Data.GetDataPresent(DataFormats.FileDrop))
        {
            e.Effects = DragDropEffects.Copy;
        }
        else
        {
            e.Effects = DragDropEffects.None;
        }
    }

    private void FixAchievements_Click(object sender, RoutedEventArgs e)
    {
        // handle the fix achievements button click here!
    }
}
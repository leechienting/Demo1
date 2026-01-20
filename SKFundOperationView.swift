//
//  SKFundOperationView.swift
//  SKBankX
//
//  Created by APP技術部-周旻鋒 on 2023/4/13.
//

import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import Stevia
import RxGesture

class SKFundOperationView: UIView {
    
    /// The dispose bag for managing Rx subscriptions.
    public var bag = DisposeBag()
    
    /// Relay for handling cell tap events with the index of the tapped item.
    public var tapCellRelay = PublishRelay<Int>()
    
    /// Relay for handling the "list" button tap event.
    public var tapBtnListRelay: PublishRelay<Void> = PublishRelay()
    
    /// Relay for providing the data source for the fund operation table.
    public lazy var fundOperationDataRelay: PublishRelay<[SKFundOperationSection]> = PublishRelay()
    
    /// The title text displayed in the view.
    public var title: String
    
    private let cellIdentifier = "SKFundOperationCell"
    
    private lazy var dataSource = RxTableViewSectionedReloadDataSource<SKFundOperationSection>{
        dataSource, tableView, indexPath, element in
        guard let cell = tableView.dequeueReusableCell(withIdentifier: self.cellIdentifier, for: indexPath) as? SKFundOperationCell else {
            return UITableViewCell()
        }
        
        var bShowSeparatorLine: Bool = false
        if (indexPath.row == dataSource[indexPath.section].items.count-1) {
            bShowSeparatorLine = false
        }
        else {
            bShowSeparatorLine = true
        }
        
        cell.setContent(type: element.type,showSeparatorLine: bShowSeparatorLine)
        cell.selectionStyle = .none
        cell.accessoryType = .none
        return cell
    }
    
    private lazy var lblTitle: UILabel = {
        let label = UILabel()
        label.font = SKFont.font(nameType: .System, weightType: .medium, fontSize: 18)
        label.text = self.title
        label.textAlignment = .left
        return label
    }()
    
    private lazy var ivBack: UIImageView = {
        let iv = UIImageView()
        iv.contentMode = .scaleToFill
        return iv
    }()
    
    private lazy var btnList: SKNormalButton = {
        let btn = SKNormalButton()
        btn.font = SKFont.font(nameType: .System, weightType: .medium, fontSize: 14)
        btn.text("InvestHome.SKFundOperationView.btnList".localized)
        btn.cornerRadius = 16
        return btn
    }()
    
    public lazy var tbViewList: UITableView = {
        let tbView = UITableView()
        tbView.register(SKFundOperationCell.self, forCellReuseIdentifier: cellIdentifier)
        tbView.estimatedRowHeight = 60
        tbView.layer.cornerRadius = 16
        tbView.bounces = false
        tbView.isScrollEnabled = false
        tbView.tableFooterView = UIView(frame: .zero)
        tbView.rowHeight = UITableView.automaticDimension
        if #available(iOS 15.0, *) {
            tbView.sectionHeaderTopPadding = 0
        }
        tbView.separatorStyle = .none
        return tbView
    }()
    
    /// Initializes a new instance of the fund operation view.
    /// - Parameter title: The title string to be displayed.
    init(title: String) {
        self.title = title
        super.init(frame: .zero)
        self.setupView()
        self.bindView()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.applyTheme()
    }
    
    private func setupView() {
        self.subviews(
            self.lblTitle,
            self.tbViewList
        )
        
        self.setupLayout()
        self.applyTheme()
    }
    
    private func setupLayout() {
        
        self.layout(
            0,
            |-16⁃self.lblTitle.height(24)⁃21-|,
            16,
            |-16⁃self.tbViewList.height(1)⁃16-|,
            0
        )
        
        self.btnList.fillHorizontally()
    }
    
    private func applyTheme() {
        let current = Theme.shard.current
        self.ivBack.image = current.Login_NormalButtonBackgroundImage
        self.btnList.setImage(current.ivListWhite)
        self.lblTitle.textColor = current.Color_SpaceGray1_CalmBlue7
    }
    
    private func bindView() {
        // 監聽高度變化
        self.tbViewList.rx.observe(CGSize.self, #keyPath(UITableView.contentSize))
            .asObservable()
            .compactMap{ $0 }
            .observe(on: MainScheduler.instance)
            .withUnretained(self)
            .subscribe(onNext: { owner, result in
                owner.tbViewList.heightConstraint?.constant = result.height
            })
            .disposed(by: self.bag)
        
        self.fundOperationDataRelay
            .observe(on: MainScheduler.instance)
            .bind(to: self.tbViewList.rx.items(dataSource: self.dataSource))
            .disposed(by: self.bag)
        
        self.tbViewList
            .rx
            .itemSelected
            .map({ $0.item })
            .bind(to: self.tapCellRelay)
            .disposed(by: self.bag)
        
        self.btnList
            .rx
            .tap
            .bind(to: tapBtnListRelay)
            .disposed(by: self.bag)
    }
}
